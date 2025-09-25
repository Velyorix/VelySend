import { EmailAccount, Template, Contact, EmailHistory, EmailStatus } from '@/types';

export const mockAccounts: EmailAccount[] = [
  {
    id: '1',
    label: 'Commercial',
    fromName: 'Équipe Commerciale',
    fromEmail: 'commercial@velyorix.com',
    host: 'smtp.velyorix.com',
    port: 587,
    security: 'STARTTLS',
    username: 'commercial@velyorix.com',
    password: '••••••••',
    rateLimit: 60,
    signature: '<p>Cordialement,<br><strong>Équipe Commerciale</strong><br>Velyorix</p>',
    isDefault: true,
    isActive: true,
    lastTested: new Date(),
    testStatus: 'success',
  },
  {
    id: '2',
    label: 'Facturation',
    fromName: 'Service Facturation',
    fromEmail: 'facturation@velyorix.com',
    host: 'smtp.velyorix.com',
    port: 587,
    security: 'STARTTLS',
    username: 'facturation@velyorix.com',
    password: '••••••••',
    rateLimit: 30,
    signature: '<p>Service Facturation<br>Velyorix<br>+33 1 23 45 67 89</p>',
    isDefault: false,
    isActive: true,
    lastTested: new Date(Date.now() - 86400000),
    testStatus: 'success',
  },
];

export const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Relance Devis',
    description: 'Template pour relancer les prospects ayant reçu un devis',
    subject: 'Suivi de votre devis {{quote_ref}} - {{company}}',
    htmlContent: `
      <h2>Bonjour {{first_name}},</h2>
      <p>J'espère que vous allez bien. Je me permets de revenir vers vous concernant le devis <strong>{{quote_ref}}</strong> que nous avons établi pour {{company}}.</p>
      <p>Avez-vous eu l'occasion de l'examiner ? Je reste à votre disposition pour toute question ou précision.</p>
      <p>N'hésitez pas à me contacter si vous souhaitez discuter des détails ou des modalités.</p>
      <div style="margin: 20px 0;">
        <a href="{{cta_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Voir le devis</a>
      </div>
      <p>Belle journée à vous !</p>
    `,
    variables: ['first_name', 'company', 'quote_ref', 'cta_url'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-10'),
    usageCount: 45,
  },
  {
    id: '2',
    title: 'Onboarding Client',
    description: 'Email de bienvenue pour les nouveaux clients',
    subject: 'Bienvenue chez Velyorix, {{first_name}} ! 🎉',
    htmlContent: `
      <h1>Bienvenue {{first_name}} ! 🎉</h1>
      <p>Nous sommes ravis de vous compter parmi nos clients chez <strong>{{company}}</strong>.</p>
      <p>Voici les prochaines étapes pour bien commencer :</p>
      <ul>
        <li>Connexion à votre espace client</li>
        <li>Configuration de vos préférences</li>
        <li>Découverte de nos fonctionnalités</li>
      </ul>
      <div style="margin: 20px 0;">
        <a href="{{onboarding_url}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Commencer</a>
      </div>
      <p>Notre équipe est là pour vous accompagner !</p>
    `,
    variables: ['first_name', 'company', 'onboarding_url'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
    usageCount: 23,
  },
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    email: 'marie.durand@exemple.fr',
    firstName: 'Marie',
    lastName: 'Durand',
    company: 'TechCorp',
    tags: ['prospect', 'priority'],
    variables: {
      first_name: 'Marie',
      company: 'TechCorp',
      phone: '+33 1 23 45 67 89',
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '2',
    email: 'paul.martin@startup.com',
    firstName: 'Paul',
    lastName: 'Martin',
    company: 'StartupTech',
    tags: ['client', 'vip'],
    variables: {
      first_name: 'Paul',
      company: 'StartupTech',
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    email: 'sophie.bernard@consulting.fr',
    firstName: 'Sophie',
    lastName: 'Bernard',
    company: 'Consulting Plus',
    tags: ['prospect'],
    variables: {
      first_name: 'Sophie',
      company: 'Consulting Plus',
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    email: 'thomas.petit@innovation.com',
    firstName: 'Thomas',
    lastName: 'Petit',
    company: 'Innovation Lab',
    tags: ['client'],
    variables: {
      first_name: 'Thomas',
      company: 'Innovation Lab',
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '5',
    email: 'laura.garcia@digital.es',
    firstName: 'Laura',
    lastName: 'Garcia',
    company: 'Digital España',
    tags: ['prospect', 'international'],
    variables: {
      first_name: 'Laura',
      company: 'Digital España',
    },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-12'),
  },
];

const generateMockHistory = (): EmailHistory[] => {
  const statuses: EmailStatus[] = ['sent', 'failed', 'scheduled', 'sending'];
  const history: EmailHistory[] = [];
  
  for (let i = 0; i < 12; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    history.push({
      id: `hist-${i + 1}`,
      accountId: mockAccounts[Math.floor(Math.random() * mockAccounts.length)].id,
      templateId: Math.random() > 0.3 ? mockTemplates[Math.floor(Math.random() * mockTemplates.length)].id : undefined,
      to: [mockContacts[Math.floor(Math.random() * mockContacts.length)].email],
      cc: Math.random() > 0.7 ? ['cc@exemple.fr'] : undefined,
      bcc: Math.random() > 0.9 ? ['bcc@exemple.fr'] : undefined,
      subject: `Email ${i + 1} - ${status === 'failed' ? 'Erreur' : 'Succès'}`,
      htmlContent: `<p>Contenu de l'email ${i + 1}</p>`,
      status,
      sentAt: status === 'sent' ? date : undefined,
      scheduledAt: status === 'scheduled' ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      attempts: status === 'failed' ? Math.floor(Math.random() * 3) + 1 : 1,
      duration: status === 'sent' ? Math.floor(Math.random() * 5000) + 500 : undefined,
      errorMessage: status === 'failed' ? 'Erreur SMTP : Connexion refusée par le serveur' : undefined,
      smtpLogs: status !== 'scheduled' ? [
        '220 smtp.exemple.com ESMTP ready',
        '250 OK',
        status === 'failed' ? '554 Transaction failed' : '250 Message accepted',
      ] : undefined,
      variables: {
        first_name: 'Test',
        company: 'Exemple',
      },
    });
  }
  
  return history.sort((a, b) => {
    const dateA = a.sentAt || a.scheduledAt || new Date(0);
    const dateB = b.sentAt || b.scheduledAt || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
};

export const mockHistory = generateMockHistory();