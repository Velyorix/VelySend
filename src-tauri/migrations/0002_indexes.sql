CREATE INDEX idx_email_jobs_account_date
    ON email_jobs(accountId, createdAt);

CREATE INDEX idx_templates_title
    ON templates(title);

CREATE INDEX idx_contacts_email
    ON contacts(email);
