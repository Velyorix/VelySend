#![allow(dead_code)]

use anyhow::{anyhow, Result};
use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use base64::{engine::general_purpose, Engine as _};
use rand::RngCore;
use std::convert::TryInto;

pub fn generate_salt() -> [u8; 16] {
    let mut salt = [0u8; 16];
    rand::thread_rng().fill_bytes(&mut salt);
    salt
}

pub fn derive_key_from_password(password: &str, salt: &[u8]) -> Result<[u8; 32]> {
    let argon2 = Argon2::default();
    let mut key = [0u8; 32];
    argon2
        .hash_password_into(password.as_bytes(), salt, &mut key)
        .map_err(|e| anyhow!("Argon2 derive error: {e}"))?;
    Ok(key)
}

pub fn encrypt_aes_gcm_to_b64(key: &[u8; 32], plaintext: &str) -> Result<String> {
    let cipher = Aes256Gcm::new_from_slice(key)?;
    let mut nonce_bytes = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);

    // pas d’annotation : le type est inféré par `encrypt`
    let nonce = Nonce::from(nonce_bytes);

    let ciphertext = cipher
        .encrypt(&nonce, plaintext.as_bytes())
        .map_err(|e| anyhow!("AES-GCM encrypt error: {e}"))?;
    let mut out = nonce_bytes.to_vec();
    out.extend_from_slice(&ciphertext);
    Ok(general_purpose::STANDARD.encode(out))
}

pub fn decrypt_aes_gcm_from_b64(key: &[u8; 32], b64: &str) -> Result<String> {
    let data = general_purpose::STANDARD
        .decode(b64)
        .map_err(|e| anyhow!("Base64 decode error: {e}"))?;
    if data.len() < 13 {
        return Err(anyhow!("Cipher payload too short"));
    }
    let (nonce_bytes, ciphertext) = data.split_at(12);

    // slice -> [u8; 12] -> Nonce, sans annotation
    let nonce_arr: [u8; 12] = nonce_bytes
        .try_into()
        .map_err(|_| anyhow!("Invalid nonce length"))?;
    let nonce = Nonce::from(nonce_arr);

    let cipher = Aes256Gcm::new_from_slice(key)?;
    let plaintext = cipher
        .decrypt(&nonce, ciphertext)
        .map_err(|e| anyhow!("AES-GCM decrypt error: {e}"))?;
    Ok(String::from_utf8(plaintext)?)
}

pub fn hash_master_password(password: &str) -> Result<String> {
    let salt = SaltString::generate(&mut rand::thread_rng());
    let argon2 = Argon2::default();
    let hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| anyhow!("Argon2 hash error: {e}"))?
        .to_string();
    Ok(hash)
}

pub fn verify_master_password(password: &str, phc_hash: &str) -> Result<bool> {
    let parsed = PasswordHash::new(phc_hash).map_err(|e| anyhow!("Invalid PHC hash: {e}"))?;
    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed)
        .is_ok())
}