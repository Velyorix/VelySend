import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { VariableChip } from '@/components/ui/variable-chip';
import { mockTemplates } from '@/stores/mockData';
import { Template } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Calendar,
  User,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function TemplatesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    description: '',
    subject: '',
    htmlContent: '',
  });
  
  const filteredTemplates = mockTemplates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  };
  
  const handleCreateTemplate = () => {
    if (!newTemplate.title.trim()) {
      toast({
        title: 'Titre requis',
        description: 'Veuillez saisir un titre pour le template',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Template créé !',
      description: `Le template "${newTemplate.title}" a été créé avec succès`,
    });
    
    setNewTemplate({ title: '', description: '', subject: '', htmlContent: '' });
    setIsCreateDialogOpen(false);
  };
  
  const handleUseTemplate = (template: Template) => {
    toast({
      title: 'Template chargé',
      description: `Redirection vers le composer avec le template "${template.title}"`,
    });
  };
  
  const handleDuplicateTemplate = (template: Template) => {
    toast({
      title: 'Template dupliqué',
      description: `Une copie de "${template.title}" a été créée`,
    });
  };
  
  const handleDeleteTemplate = (template: Template) => {
    toast({
      title: 'Template supprimé',
      description: `Le template "${template.title}" a été supprimé`,
      variant: 'destructive',
    });
  };
  
  const handleTestSend = (template: Template) => {
    toast({
      title: 'Test envoyé',
      description: `Email de test envoyé avec le template "${template.title}"`,
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Templates d'emails</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos modèles d'emails réutilisables
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={newTemplate.title}
                        onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                        placeholder="Nom du template"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                        placeholder="Sujet de l'email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                      placeholder="Description du template..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contenu HTML</Label>
                    <RichTextEditor
                      html={newTemplate.htmlContent}
                      onChange={(html) => setNewTemplate({ ...newTemplate, htmlContent: html })}
                      placeholder="Contenu de votre template..."
                    />
                  </div>
                  
                  {newTemplate.htmlContent && (
                    <div className="space-y-2">
                      <Label>Variables détectées</Label>
                      <div className="flex flex-wrap gap-2">
                        {extractVariables(newTemplate.subject + ' ' + newTemplate.htmlContent).map((variable) => (
                          <VariableChip key={variable} variable={variable} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Créer le template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredTemplates.length} template{filteredTemplates.length > 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'Aucun template trouvé' : 'Aucun template'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Essayez de modifier votre recherche'
                  : 'Commencez par créer votre premier template d\'email'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un template
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="card-interactive"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{template.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(template);
                        }}
                        title="Utiliser ce template"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                          setIsEditDialogOpen(true);
                        }}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-muted-foreground mb-1">Sujet:</p>
                    <p className="line-clamp-1">{template.subject || 'Non défini'}</p>
                  </div>
                  
                  {template.variables.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Variables:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((variable) => (
                          <VariableChip key={variable} variable={variable} />
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.variables.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(template.updatedAt, { addSuffix: true, locale: fr })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {template.usageCount} utilisations
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(template);
                        }}
                        title="Dupliquer"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template);
                        }}
                        title="Supprimer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                    >
                      Utiliser
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestSend(template);
                      }}
                    >
                      Test
                    </Button>
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