import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  ExternalLink, 
  Heart,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Globe,
  Shield,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function HelpPage() {
  const { toast } = useToast();
  
  const handleContactSupport = () => {
    toast({
      title: 'Contact support',
      description: 'Redirection vers https://velyorix.com (mockée)',
    });
  };
  
  const faqItems = [
    {
      question: "Comment configurer un compte SMTP ?",
      answer: "Rendez-vous dans la section 'Comptes SMTP', cliquez sur 'Ajouter un compte' et renseignez les informations de votre serveur SMTP : host, port, sécurité (TLS/STARTTLS), nom d'utilisateur et mot de passe. N'oubliez pas de tester la configuration."
    },
    {
      question: "Pourquoi mes emails sont-ils en échec ?",
      answer: "Les échecs peuvent être dus à plusieurs raisons : mauvaise configuration SMTP, destinataire inexistant, serveur indisponible, ou dépassement des limites d'envoi. Consultez les logs SMTP dans l'historique pour plus de détails."
    },
    {
      question: "Quelle est la taille maximale des pièces jointes ?",
      answer: "La taille maximale par fichier est de 25 MB. Cette limite peut varier selon votre serveur SMTP. Nous recommandons d'utiliser des services de partage de fichiers pour les gros documents."
    },
    {
      question: "Comment utiliser les variables dans mes templates ?",
      answer: "Utilisez la syntaxe {{nom_variable}} dans vos templates. Les variables courantes sont {{first_name}}, {{last_name}}, {{company}}, {{email}}. Vous pouvez créer des variables personnalisées selon vos besoins."
    },
    {
      question: "Comment planifier l'envoi d'emails ?",
      answer: "Dans le compositeur, cliquez sur 'Planifier' et choisissez la date et l'heure souhaitées. Les emails planifiés apparaîtront dans l'historique avec le statut 'Planifié' jusqu'à leur envoi."
    },
    {
      question: "Puis-je annuler un email planifié ?",
      answer: "Oui, tant que l'email n'a pas été envoyé, vous pouvez l'annuler depuis l'historique en cliquant sur l'email planifié et en sélectionnant 'Annuler l'envoi'."
    },
    {
      question: "Comment importer mes contacts ?",
      answer: "Allez dans la section 'Contacts', cliquez sur 'Importer' et sélectionnez votre fichier CSV. Assurez-vous que votre fichier contient au minimum une colonne 'email' et optionnellement 'first_name', 'last_name', 'company'."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, toutes vos données sont stockées localement sur votre machine. Nous ne transmettons aucune information à nos serveurs. Vous pouvez également configurer un mot de passe maître pour plus de sécurité."
    }
  ];
  
  const dependencies = [
    { name: 'React', version: '18.3.1', license: 'MIT' },
    { name: 'TypeScript', version: '5.0+', license: 'Apache-2.0' },
    { name: 'Tailwind CSS', version: '3.4+', license: 'MIT' },
    { name: 'Radix UI', version: '1.0+', license: 'MIT' },
    { name: 'Lucide React', version: '0.400+', license: 'ISC' },
    { name: 'React Router', version: '6.30+', license: 'MIT' },
    { name: 'Date-fns', version: '3.6+', license: 'MIT' },
    { name: 'Zustand', version: '4.5+', license: 'MIT' },
  ];
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Velyorix</h1>
              <p className="text-sm text-muted-foreground">Email Pro</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Solution professionnelle d'envoi d'emails en masse
          </p>
        </div>
        
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              À propos de Velyorix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Performant</h3>
                <p className="text-sm text-muted-foreground">
                  Envoi rapide et fiable avec gestion des erreurs
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-medium">Sécurisé</h3>
                <p className="text-sm text-muted-foreground">
                  Données stockées localement, chiffrement disponible
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="h-6 w-6 text-info" />
                </div>
                <h3 className="font-medium">Universel</h3>
                <p className="text-sm text-muted-foreground">
                  Compatible avec tous les serveurs SMTP standards
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Version de l'application</p>
                <p className="text-sm text-muted-foreground">v1.0.0-beta</p>
              </div>
              <Badge variant="secondary">Beta</Badge>
            </div>
            
            <div>
              <p className="font-medium mb-2">Nouveautés récentes</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Interface utilisateur repensée</li>
                <li>• Nouvel éditeur de templates</li>
                <li>• Amélioration des performances d'envoi</li>
                <li>• Support des thèmes sombre/clair</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support & Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-medium mb-2">Besoin d'aide ?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Notre équipe est là pour vous accompagner dans l'utilisation de Velyorix.
                  </p>
                  <Button onClick={handleContactSupport} className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contacter Velyorix
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Moyens de contact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Site web : velyorix.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email : support@velyorix.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Chat en ligne disponible</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Temps de réponse</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>• Questions générales : 24h</p>
                    <p>• Problèmes techniques : 4-8h</p>
                    <p>• Urgences : 1-2h</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        {/* Licenses */}
        <Card>
          <CardHeader>
            <CardTitle>Licences et dépendances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Velyorix utilise les bibliothèques open source suivantes :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dependencies.map((dep) => (
                  <div key={dep.name} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium text-sm">{dep.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">v{dep.version}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {dep.license}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center py-6 border-t">
          <p className="text-sm text-muted-foreground">
            © 2024 Velyorix — Tous droits réservés
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Fait avec ❤️ pour les professionnels de l'email marketing
          </p>
        </div>
      </div>
    </div>
  );
}