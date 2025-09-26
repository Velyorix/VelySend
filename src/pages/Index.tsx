import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Zap, Shield, Globe, FileText, Server, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-elegant">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold">
            Bienvenue dans{' '}
            <span className="text-gradient">VelySend</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Votre solution professionnelle d'envoi d'emails en masse. 
            Gérez vos campagnes, templates et contacts en toute simplicité.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button size="lg" className="px-8" asChild>
              <a href="/composer">
                <Mail className="h-5 w-5 mr-2" />
                Composer un email
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
            
            <Button variant="outline" size="lg" className="px-8" asChild>
              <a href="/help">
                Découvrir Velyorix
              </a>
            </Button>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="card-interactive">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Envoi performant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gestion avancée des envois avec throttling, retry automatique et monitoring en temps réel.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-interactive">
            <CardHeader>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Sécurité maximale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Données stockées localement, chiffrement optionnel et respect total de votre confidentialité.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-interactive">
            <CardHeader>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-info" />
              </div>
              <CardTitle>Compatible universel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fonctionne avec tous les serveurs SMTP : Gmail, Outlook, serveurs dédiés et plus encore.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-center">Commencer rapidement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <a href="/composer">
                  <Mail className="h-6 w-6" />
                  <span>Composer</span>
                </a>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <a href="/templates">
                  <FileText className="h-6 w-6" />
                  <span>Templates</span>
                </a>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <a href="/accounts">
                  <Server className="h-6 w-6" />
                  <span>Comptes SMTP</span>
                </a>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <a href="/contacts">
                  <Users className="h-6 w-6" />
                  <span>Contacts</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
