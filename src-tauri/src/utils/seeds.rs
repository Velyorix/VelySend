use anyhow::Result;
use sqlx::SqlitePool;

pub async fn seed_if_needed(pool: &SqlitePool) -> Result<()> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM templates")
        .fetch_one(pool)
        .await
        .unwrap_or(0);

    if count > 0 {
        return Ok(());
    }

    let q = r#"
    INSERT INTO templates (title, description, subject, bodyHtml, attachmentsJson, variablesJson, createdAt, updatedAt)
    VALUES
      (
        'Relance Devis — Classique',
        'Relance simple après envoi d’un devis',
        'Relance concernant votre devis {{company}}',
        '<p>Bonjour {{first_name}},</p>
<p>Je me permets de revenir vers vous au sujet du devis envoyé le {{quote_date}}.
Avez-vous eu le temps d’y jeter un œil ?</p>
<p>Je reste disponible pour toute question.</p>
<p>Cordialement,<br>{{sender_name}}<br>{{sender_company}}</p>',
        '[]',
        '["first_name","company","quote_date","sender_name","sender_company"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ),
      (
        'Onboarding — Bienvenue',
        'Message de bienvenue avec prochaines étapes',
        'Bienvenue {{first_name}} chez {{company}}',
        '<h1>Bienvenue {{first_name}} !</h1>
<p>Ravi·e de vous compter parmi nos client·e·s.</p>
<ol>
  <li>Activez votre compte : {{activation_link}}</li>
  <li>Planifiez une session d’onboarding : {{onboarding_link}}</li>
</ol>
<p>À très vite,<br>{{sender_name}}</p>',
        '[]',
        '["first_name","company","activation_link","onboarding_link","sender_name"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ),
      (
        'Suivi — Après démo',
        'Email envoyé après une démonstration produit',
        'Suite à notre démo — {{company}}',
        '<p>Bonjour {{first_name}},</p>
<p>Merci pour votre temps lors de la démo de ce jour.</p>
<p>Récapitulatif : {{demo_summary}}</p>
<p>Prochaines étapes : {{next_steps}}</p>
<p>Bien à vous,<br>{{sender_name}}</p>',
        '[]',
        '["first_name","company","demo_summary","next_steps","sender_name"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ),
      (
        'Newsletter — Annonce',
        'Annonce d’une nouvelle fonctionnalité/produit',
        'Nouvelle fonctionnalité : {{feature_name}}',
        '<h2>{{feature_name}}</h2>
<p>{{feature_intro}}</p>
<p><a href="{{cta_link}}">Découvrir maintenant →</a></p>
<p>— L’équipe {{sender_company}}</p>',
        '[]',
        '["feature_name","feature_intro","cta_link","sender_company"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ),
      (
        'Support — Résolution',
        'Clôture d’un ticket support avec résumé',
        'Votre demande #{{ticket_id}} est résolue',
        '<p>Bonjour {{first_name}},</p>
<p>Nous avons résolu votre demande <strong>#{{ticket_id}}</strong>.</p>
<p>Résumé : {{resolution_summary}}</p>
<p>Si le problème persiste, répondez directement à cet email.</p>
<p>Cordialement,<br>{{agent_name}} — Support {{sender_company}}</p>',
        '[]',
        '["first_name","ticket_id","resolution_summary","agent_name","sender_company"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      );
    "#;

    sqlx::query(q).execute(pool).await?;
    Ok(())
}