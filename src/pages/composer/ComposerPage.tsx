import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MultiEmailInput } from '@/components/ui/multi-email-input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { VariableChip } from '@/components/ui/variable-chip';
import { useComposerStore } from '@/stores/useComposerStore';
import { mockAccounts, mockTemplates } from '@/stores/mockData';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Save, 
  Eye, 
  Calendar, 
  Paperclip, 
  Upload,
  X,
  Clock,
  TestTube,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ComposerPage() {
  const location = useLocation();
  const { toast } = useToast();
  const [showVariables, setShowVariables] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  
  const {
    accountId,
    templateId,
    to,
    cc,
    bcc,
    subject,
    htmlContent,
    attachments,
    variables,
    scheduledAt,
    isLoading,
    updateField,
    addEmail,
    removeEmail,
    loadTemplate,
    updateVariable,
    addAttachment,
    removeAttachment,
    saveDraft,
    sendEmail,
    scheduleEmail,
    reset,
  } = useComposerStore();
  
  // Load initial data from route state (navigation from other pages)
  useEffect(() => {
    const state = location.state as any;
    if (state?.templateId) {
      const template = mockTemplates.find(t => t.id === state.templateId);
      if (template) {
        loadTemplate(template);
        setShowVariables(template.variables.length > 0);
      }
    }
    if (state?.to) {
      state.to.forEach((email: string) => addEmail(email, 'to'));
    }
  }, [location.state, loadTemplate, addEmail]);
  
  const currentTemplate = templateId ? mockTemplates.find(t => t.id === templateId) : null;
  const selectedAccount = accountId ? mockAccounts.find(a => a.id === accountId) : mockAccounts.find(a => a.isDefault);
  
  const handleTemplateChange = (value: string) => {
    if (value === 'none') {
      updateField('templateId', undefined);
      updateField('subject', '');
      updateField('htmlContent', '');
      updateField('variables', {});
      setShowVariables(false);
    } else {
      const template = mockTemplates.find(t => t.id === value);
      if (template) {
        loadTemplate(template);
        setShowVariables(template.variables.length > 0);
      }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 25 * 1024 * 1024) {
          toast({
            title: 'Fichier trop volumineux',
            description: `${file.name} dépasse la limite de 25 MB`,
            variant: 'destructive',
          });
          return;
        }
        addAttachment(file);
      });
    }
  };
  
  const handleSend = async () => {
    if (!to.length) {
      toast({
        title: 'Destinataires requis',
        description: 'Veuillez ajouter au moins un destinataire',
        variant: 'destructive',
      });
      return;
    }
    
    if (!subject.trim()) {
      toast({
        title: 'Sujet requis',
        description: 'Veuillez saisir un sujet pour votre email',
        variant: 'destructive',
      });
      return;
    }
    
    const missingVariables = currentTemplate?.variables.filter(v => !variables[v]?.trim()) || [];
    if (missingVariables.length > 0) {
      toast({
        title: 'Variables manquantes',
        description: `Veuillez remplir: ${missingVariables.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await sendEmail();
      toast({
        title: 'Email envoyé !',
        description: `Votre message a été envoyé à ${to.length} destinataire${to.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'envoi',
        description: 'Une erreur est survenue lors de l\'envoi',
        variant: 'destructive',
      });
    }
  };
  
  const handleSaveDraft = async () => {
    try {
      await saveDraft();
      toast({
        title: 'Brouillon enregistré',
        description: 'Votre brouillon a été sauvegardé',
      });
    } catch (error) {
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder le brouillon',
        variant: 'destructive',
      });
    }
  };
  
  const handleTestSend = () => {
    if (!selectedAccount?.fromEmail) return;
    
    toast({
      title: 'Test envoyé',
      description: `Email de test envoyé à ${selectedAccount.fromEmail}`,
    });
  };
  
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Composer */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Nouveau message
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast({ title: 'Aperçu', description: 'Fonctionnalité à venir' })}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Brouillon
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Account Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Compte d'envoi</Label>
                  <Select 
                    value={accountId || selectedAccount?.id || ''} 
                    onValueChange={(value) => updateField('accountId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un compte" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{account.label}</span>
                            <span className="text-xs text-muted-foreground">{account.fromEmail}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={templateId || 'none'} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun template</SelectItem>
                      {mockTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              {/* Recipients */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="to">Destinataires *</Label>
                  <MultiEmailInput
                    value={to}
                    onChange={(emails) => updateField('to', emails)}
                    placeholder="Ajouter des destinataires..."
                  />
                </div>
                
                <div className="flex gap-2">
                  {!showCc && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowCc(true)}
                    >
                      + CC
                    </Button>
                  )}
                  {!showBcc && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowBcc(true)}
                    >
                      + BCC
                    </Button>
                  )}
                </div>
                
                {showCc && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="cc">CC</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setShowCc(false);
                          updateField('cc', []);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <MultiEmailInput
                      value={cc || []}
                      onChange={(emails) => updateField('cc', emails)}
                      placeholder="Ajouter des destinataires en copie..."
                    />
                  </div>
                )}
                
                {showBcc && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="bcc">BCC</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setShowBcc(false);
                          updateField('bcc', []);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <MultiEmailInput
                      value={bcc || []}
                      onChange={(emails) => updateField('bcc', emails)}
                      placeholder="Ajouter des destinataires en copie cachée..."
                    />
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  placeholder="Objet de votre email..."
                />
              </div>
              
              {/* Content Editor */}
              <div className="space-y-2">
                <Label>Contenu</Label>
                <RichTextEditor
                  html={htmlContent}
                  onChange={(html) => updateField('htmlContent', html)}
                  placeholder="Composez votre message..."
                />
              </div>
              
              {/* Attachments */}
              <div className="space-y-2">
                <Label>Pièces jointes</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Ajouter des fichiers
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <span className="text-xs text-muted-foreground">
                      Max 25 MB par fichier
                    </span>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{attachment.name}</span>
                            <Badge variant="secondary">
                              {(attachment.size / 1024 / 1024).toFixed(1)} MB
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(attachment.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={isLoading || !to.length}
                className="px-6"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toast({ title: 'Planification', description: 'Fonctionnalité à venir' })}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Planifier
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestSend}
                disabled={!selectedAccount}
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast({ title: 'Duplication', description: 'Brouillon dupliqué' })}
              >
                <Copy className="h-4 w-4 mr-2" />
                Dupliquer
              </Button>
            </div>
          </div>
        </div>
        
        {/* Variables Panel */}
        {showVariables && currentTemplate && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variables du template</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Remplissez les variables pour personnaliser votre message
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentTemplate.variables.map((variable) => (
                  <VariableChip
                    key={variable}
                    variable={variable}
                    value={variables[variable] || ''}
                    isRequired={true}
                    onValueChange={(value) => updateVariable(variable, value)}
                  />
                ))}
                
                {currentTemplate.variables.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Ce template ne contient pas de variables.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}