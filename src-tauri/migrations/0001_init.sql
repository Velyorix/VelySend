PRAGMA foreign_keys = ON;

CREATE TABLE accounts (
id                INTEGER PRIMARY KEY AUTOINCREMENT,
label             TEXT NOT NULL,
fromName          TEXT,
fromEmail         TEXT NOT NULL,
host              TEXT NOT NULL,
port              INTEGER NOT NULL,
security          TEXT NOT NULL,
username          TEXT,
passwordEnc       BLOB,
signatureHtml     TEXT,
rateLimitPerMin   INTEGER DEFAULT 60,
createdAt         DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt         DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE templates (
id              INTEGER PRIMARY KEY AUTOINCREMENT,
title           TEXT NOT NULL,
description     TEXT,
subject         TEXT,
bodyHtml        TEXT,
attachmentsJson TEXT,
variablesJson   TEXT,
createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
id          INTEGER PRIMARY KEY AUTOINCREMENT,
email       TEXT NOT NULL UNIQUE,
firstName   TEXT,
lastName    TEXT,
company     TEXT,
tagsJson    TEXT,
customJson  TEXT,
createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_jobs (
id            INTEGER PRIMARY KEY AUTOINCREMENT,
accountId     INTEGER NOT NULL,
subject       TEXT,
bodyHtml      TEXT,
bodyText      TEXT,
toJson        TEXT,
ccJson        TEXT,
bccJson       TEXT,
attachmentsJson TEXT,
status        TEXT NOT NULL,
errorMessage  TEXT,
scheduledAt   DATETIME,
sentAt        DATETIME,
durationMs    INTEGER,
smtpMetaJson  TEXT,
templateId    INTEGER,
variablesJson TEXT,
createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(accountId) REFERENCES accounts(id) ON DELETE CASCADE,
FOREIGN KEY(templateId) REFERENCES templates(id) ON DELETE SET NULL
);
