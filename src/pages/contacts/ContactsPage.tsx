import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockContacts } from '@/stores/mockData';
import { Contact } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail,
  Upload,
  Download,
  Filter,
  UserPlus,
  Building,
  Tag,
  Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function ContactsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    tags: [] as string[],
  });
  
  const allTags = Array.from(new Set(mockContacts.flatMap(contact => contact.tags)));
  
  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = searchQuery === '' || 
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = tagFilter === 'all' || contact.tags.includes(tagFilter);
    
    return matchesSearch && matchesTag;
  });
  
  const handleCreateContact = () => {
    if (!newContact.email.trim()) {
      toast({
        title: 'Email requis',
        description: 'Veuillez saisir une adresse email',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Contact créé !',
      description: `Le contact ${newContact.email} a été ajouté`,
    });
    
    setNewContact({ email: '', firstName: '', lastName: '', company: '', tags: [] });
    setIsCreateDialogOpen(false);
  };
  
  const handleDeleteContact = (contact: Contact) => {
    toast({
      title: 'Contact supprimé',
      description: `${contact.email} a été supprimé de vos contacts`,
      variant: 'destructive',
    });
  };
  
  const handleSendEmail = (contact: Contact) => {
    toast({
      title: 'Redirection...',
      description: `Ouverture du composer avec ${contact.email}`,
    });
  };
  
  const handleImportCSV = () => {
    toast({
      title: 'Import CSV',
      description: 'Fonctionnalité d\'import CSV (mockée)',
    });
    setIsImportDialogOpen(false);
  };
  
  const handleExportCSV = () => {
    toast({
      title: 'Export réussi',
      description: 'Vos contacts ont été exportés au format CSV',
    });
  };
  
  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };
  
  const getDisplayName = (contact: Contact) => {
    if (contact.firstName && contact.lastName) {
      return `${contact.firstName} ${contact.lastName}`;
    }
    if (contact.firstName) {
      return contact.firstName;
    }
    return contact.email;
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">
              Gérez votre carnet d'adresses pour vos campagnes email
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importer des contacts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Fichier CSV</Label>
                    <Input type="file" accept=".csv" />
                    <p className="text-xs text-muted-foreground">
                      Le fichier doit contenir les colonnes : email, firstName, lastName, company
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Exemple de format :</Label>
                    <div className="bg-muted p-3 rounded text-sm font-mono">
                      email,firstName,lastName,company<br/>
                      john@exemple.com,John,Doe,ACME Corp<br/>
                      marie@test.fr,Marie,Martin,Tech Plus
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleImportCSV}>
                      Importer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      placeholder="contact@exemple.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={newContact.firstName}
                        onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={newContact.lastName}
                        onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      value={newContact.company}
                      onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                      placeholder="ACME Corp"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {['prospect', 'client', 'vip', 'priority', 'international'].map((tag) => (
                        <Badge
                          key={tag}
                          variant={newContact.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const updatedTags = newContact.tags.includes(tag)
                              ? newContact.tags.filter(t => t !== tag)
                              : [...newContact.tags, tag];
                            setNewContact({ ...newContact, tags: updatedTags });
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateContact}>
                      Créer le contact
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom, email, entreprise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag</label>
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setTagFilter('all');
                  }}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockContacts.length}</p>
                  <p className="text-sm text-muted-foreground">Contacts total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Tag className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{mockContacts.filter(c => c.tags.includes('client')).length}</p>
                  <p className="text-sm text-muted-foreground">Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <UserPlus className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{mockContacts.filter(c => c.tags.includes('prospect')).length}</p>
                  <p className="text-sm text-muted-foreground">Prospects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-info" />
                <div>
                  <p className="text-2xl font-bold">{new Set(mockContacts.map(c => c.company).filter(Boolean)).size}</p>
                  <p className="text-sm text-muted-foreground">Entreprises</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || tagFilter !== 'all' ? 'Aucun contact trouvé' : 'Aucun contact'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || tagFilter !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par ajouter vos premiers contacts'
                }
              </p>
              {!searchQuery && tagFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un contact
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="card-interactive">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-medium text-primary">
                      {getInitials(contact.firstName, contact.lastName, contact.email)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{getDisplayName(contact)}</h3>
                      <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                      {contact.company && (
                        <div className="flex items-center gap-1 mt-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
                        </div>
                      )}
                      
                      {contact.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contact.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Ajouté {formatDistanceToNow(contact.createdAt, { addSuffix: true, locale: fr })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendEmail(contact)}
                        title="Envoyer un email"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact)}
                        title="Supprimer"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}