BEGIN TRANSACTION;

INSERT INTO templates (title, description, subject, bodyHtml, attachmentsJson, variablesJson, createdAt, updatedAt)
VALUES
    (
        'Relance Devis — Classique',
        'Relance simple après envoi d’un devis',
        'Relance concernant votre devis {{company}}',
        '<p>Bonjour {{first_name}},</p>\n<p>Je me permets de revenir vers vous au sujet du devis envoyé le {{quote_date}}.\nAvez-vous eu le temps d’y jeter un œil ?</p>\n<p>Je reste disponible pour toute question.</p>\n<p>Cordialement,<br>{{sender_name}}<br>{{sender_company}}</p>',
        '[]',
        '["first_name","company","quote_date","sender_name","sender_company"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
    (
        'Onboarding — Bienvenue',
        'Message de bienvenue avec prochaines étapes',
        'Bienvenue {{first_name}} chez {{company}}',
        '<h1>Bienvenue {{first_name}} !</h1>\n<p>Ravi·e de vous compter parmi nos client·e·s.</p>\n<ol>\n  <li>Activez votre compte : {{activation_link}}</li>\n  <li>Planifiez une session d’onboarding : {{onboarding_link}}</li>\n</ol>\n<p>À très vite,<br>{{sender_name}}</p>',
        '[]',
        '["first_name","company","activation_link","onboarding_link","sender_name"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
    (
        'Suivi — Après démo',
        'Email envoyé après une démonstration produit',
        'Suite à notre démo — {{company}}',
        '<p>Bonjour {{first_name}},</p>\n<p>Merci pour votre temps lors de la démo de ce jour.</p>\n<p>Récapitulatif : {{demo_summary}}</p>\n<p>Prochaines étapes : {{next_steps}}</p>\n<p>Bien à vous,<br>{{sender_name}}</p>',
        '[]',
        '["first_name","company","demo_summary","next_steps","sender_name"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
    (
        'Newsletter — Annonce',
        'Annonce d’une nouvelle fonctionnalité/produit',
        'Nouvelle fonctionnalité : {{feature_name}}',
        '<h2>{{feature_name}}</h2>\n<p>{{feature_intro}}</p>\n<p><a href="{{cta_link}}">Découvrir maintenant →</a></p>\n<p>— L’équipe {{sender_company}}</p>',
        '[]',
        '["feature_name","feature_intro","cta_link","sender_company"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
    (
        'Support — Résolution',
        'Clôture d’un ticket support avec résumé',
        'Votre demande #{{ticket_id}} est résolue',
        '<p>Bonjour {{first_name}},</p>\n<p>Nous avons résolu votre demande <strong>#{{ticket_id}}</strong>.</p>\n<p>Résumé : {{resolution_summary}}</p>\n<p>Si le problème persiste, répondez directement à cet email.</p>\n<p>Cordialement,<br>{{agent_name}} — Support {{sender_company}}</p>',
        '[]',
        '["first_name","ticket_id","resolution_summary","agent_name","sender_company"]',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    );

COMMIT;