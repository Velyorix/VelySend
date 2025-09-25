import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { mockAccounts } from '@/stores/mockData';
import { EmailAccount } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Server, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  TestTube,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Clock,
  Settings,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function AccountsPage() {
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [testingAccount, setTestingAccount] = useState<string | null>(null);
  
  const [newAccount, setNewAccount] = useState({
    label: '',
    fromName: '',
    fromEmail: '',
    host: '',
    port: 587,
    security: 'STARTTLS' as const,
    username: '',
    password: '',
    rateLimit: 60,
    signature: '',
  });
  
  const handleCreateAccount = () => {
    if (!newAccount.label.trim() || !newAccount.fromEmail.trim() || !newAccount.host.trim()) {
      toast({
        title: 'Champs requis manquants',
        description: 'Veuillez remplir au minimum le libellé, l\'email et le serveur SMTP',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Compte créé !',
      description: `Le compte "${newAccount.label}" a été créé avec succès`,
    });
    
    setNewAccount({
      label: '',
      fromName: '',
      fromEmail: '',
      host: '',
      port: 587,
      security: 'STARTTLS',
      username: '',
      password: '',
      rateLimit: 60,
      signature: '',
    });
    setIsCreateDialogOpen(false);
  };
  
  const handleTestAccount = async (account: EmailAccount) => {
    setTestingAccount(account.id);
    
    try {
      // Simulation du test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Test réussi !',
        description: `La connexion au compte "${account.label}" fonctionne correctement`,
      });
    } catch (error) {
      toast({
        title: 'Test échoué',
        description: `Impossible de se connecter au compte "${account.label}"`,
        variant: 'destructive',
      });
    } finally {
      setTestingAccount(null);
    }
  };
  
  const handleSetDefault = (account: EmailAccount) => {
    toast({
      title: 'Compte par défaut défini',
      description: `"${account.label}" est maintenant le compte par défaut`,
    });
  };
  
  const handleDuplicateAccount = (account: EmailAccount) => {
    toast({
      title: 'Compte dupliqué',
      description: `Une copie de "${account.label}" a été créée`,
    });
  };
  
  const handleDeleteAccount = (account: EmailAccount) => {
    if (account.isDefault) {
      toast({
        title: 'Impossible de supprimer',
        description: 'Vous ne pouvez pas supprimer le compte par défaut',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Compte supprimé',
      description: `Le compte "${account.label}" a été supprimé`,
      variant: 'destructive',
    });
  };
  
  const getStatusIcon = (account: EmailAccount) => {
    if (account.testStatus === 'success') return <CheckCircle className="h-4 w-4 text-success" />;
    if (account.testStatus === 'failed') return <XCircle className="h-4 w-4 text-destructive" />;
    if (account.testStatus === 'pending') return <Clock className="h-4 w-4 text-warning" />;
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  };
  
  const getStatusText = (account: EmailAccount) => {
    if (account.testStatus === 'success') return 'Testé avec succès';
    if (account.testStatus === 'failed') return 'Test échoué';
    if (account.testStatus === 'pending') return 'Test en cours';
    return 'Non testé';
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Comptes SMTP</h1>
            <p className="text-muted-foreground">
              Gérez vos comptes de messagerie pour l'envoi d'emails
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau compte
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un compte SMTP</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                {/* Informations d'affichage */}
                <div className="space-y-4">
                  <h3 className="font-medium text-primary">Informations d'affichage</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="label">Libellé *</Label>
                      <Input
                        id="label"
                        value={newAccount.label}
                        onChange={(e) => setNewAccount({ ...newAccount, label: e.target.value })}
                        placeholder="Ex: Commercial, Support..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName">Nom d'expéditeur</Label>
                      <Input
                        id="fromName"
                        value={newAccount.fromName}
                        onChange={(e) => setNewAccount({ ...newAccount, fromName: e.target.value })}
                        placeholder="Ex: Équipe Velyorix"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email d'expéditeur *</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={newAccount.fromEmail}
                      onChange={(e) => setNewAccount({ ...newAccount, fromEmail: e.target.value })}
                      placeholder="contact@monentreprise.com"
                    />
                  </div>
                </div>
                
                {/* Configuration SMTP */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-primary">Configuration SMTP</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="host">Serveur SMTP *</Label>
                      <Input
                        id="host"
                        value={newAccount.host}
                        onChange={(e) => setNewAccount({ ...newAccount, host: e.target.value })}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Port</Label>
                      <Input
                        id="port"
                        type="number"
                        value={newAccount.port}
                        onChange={(e) => setNewAccount({ ...newAccount, port: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="security">Sécurité</Label>
                    <Select 
                      value={newAccount.security} 
                      onValueChange={(value: any) => setNewAccount({ ...newAccount, security: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TLS">TLS</SelectItem>
                        <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                        <SelectItem value="PLAIN">Aucune (non recommandé)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input
                        id="username"
                        value={newAccount.username}
                        onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                        placeholder="Souvent identique à l'email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newAccount.password}
                        onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Paramètres avancés */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-primary">Paramètres avancés</h3>
                  <div className="space-y-2">
                    <Label htmlFor="rateLimit">Limite d'envoi (emails/minute)</Label>
                    <Input
                      id="rateLimit"
                      type="number"
                      value={newAccount.rateLimit}
                      onChange={(e) => setNewAccount({ ...newAccount, rateLimit: parseInt(e.target.value) })}
                      min="1"
                      max="1000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Respectez les limites de votre fournisseur SMTP
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Signature HTML</Label>
                    <RichTextEditor
                      html={newAccount.signature}
                      onChange={(html) => setNewAccount({ ...newAccount, signature: html })}
                      placeholder="Signature automatique..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateAccount}>
                    Créer le compte
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockAccounts.map((account) => (
            <Card key={account.id} className="card-interactive">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{account.label}</CardTitle>
                        {account.isDefault && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            <Star className="h-3 w-3 mr-1" />
                            Défaut
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{account.fromEmail}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {account.fromName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAccount(account)}
                      title="Paramètres"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateAccount(account)}
                      title="Dupliquer"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Serveur</p>
                    <p>{account.host}:{account.port}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Sécurité</p>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>{account.security}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Limite</p>
                    <p>{account.rateLimit} emails/min</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Statut</p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(account)}
                      <span className="text-xs">{getStatusText(account)}</span>
                    </div>
                  </div>
                </div>
                
                {account.lastTested && (
                  <div className="text-xs text-muted-foreground">
                    Dernière vérification : {formatDistanceToNow(account.lastTested, { addSuffix: true, locale: fr })}
                  </div>
                )}
                
                {!account.password && (
                  <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded text-sm">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-warning">Mot de passe non renseigné</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleTestAccount(account)}
                    disabled={testingAccount === account.id}
                  >
                    {testingAccount === account.id ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4 mr-2" />
                    )}
                    Tester
                  </Button>
                  
                  {!account.isDefault && (
                    <Button 
                      size="sm"
                      onClick={() => handleSetDefault(account)}
                    >
                      Définir par défaut
                    </Button>
                  )}
                  
                  {!account.isDefault && (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteAccount(account)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick Setup Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Gmail</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Serveur: smtp.gmail.com</p>
                  <p>Port: 587 (STARTTLS)</p>
                  <p>⚠️ Utilisez un mot de passe d'application</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Outlook/Hotmail</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Serveur: smtp-mail.outlook.com</p>
                  <p>Port: 587 (STARTTLS)</p>
                  <p>✓ Connexion avec compte Microsoft</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Serveur personnalisé</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Contactez votre hébergeur</p>
                  <p>Port: 587 ou 465 généralement</p>
                  <p>✓ Privilégiez STARTTLS ou TLS</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}