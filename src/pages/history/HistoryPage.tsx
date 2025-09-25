import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockHistory, mockAccounts } from '@/stores/mockData';
import { EmailHistory, EmailStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Filter, RefreshCw, Mail, Eye, Copy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmailStatus | 'all'>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailHistory | null>(null);
  
  const filteredHistory = mockHistory.filter(email => {
    const matchesSearch = searchQuery === '' || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.to.some(to => to.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    const matchesAccount = accountFilter === 'all' || email.accountId === accountFilter;
    
    return matchesSearch && matchesStatus && matchesAccount;
  });
  
  const getAccount = (accountId: string) => 
    mockAccounts.find(acc => acc.id === accountId);
  
  const formatDate = (date: Date) => 
    formatDistanceToNow(date, { addSuffix: true, locale: fr });
  
  const getStatusIcon = (status: EmailStatus) => {
    switch (status) {
      case 'sent': return '✓';
      case 'failed': return '✗';
      case 'scheduled': return '⏰';
      case 'sending': return '⏳';
      default: return '?';
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Historique des emails</h1>
            <p className="text-muted-foreground">
              Consultez et gérez vos envois d'emails
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Sujet, destinataire..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                    <SelectItem value="failed">Échec</SelectItem>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                    <SelectItem value="sending">En cours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Compte</label>
                <Select value={accountFilter} onValueChange={setAccountFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les comptes</SelectItem>
                    {mockAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.label}
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
                    setStatusFilter('all');
                    setAccountFilter('all');
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
        
        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredHistory.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun email trouvé</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all' || accountFilter !== 'all' 
                      ? 'Essayez de modifier vos filtres'
                      : 'Composez votre premier email pour le voir apparaître ici'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map((email) => {
                const account = getAccount(email.accountId);
                const isSelected = selectedEmail?.id === email.id;
                
                return (
                  <Card 
                    key={email.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      isSelected && 'ring-2 ring-primary'
                    )}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{email.subject}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            À: {email.to.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <StatusBadge status={email.status} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{account?.label}</span>
                          <span>
                            {email.sentAt ? formatDate(email.sentAt) :
                             email.scheduledAt ? `Planifié ${formatDate(email.scheduledAt)}` :
                             'Jamais envoyé'}
                          </span>
                          {email.attempts > 1 && (
                            <Badge variant="outline" className="text-xs">
                              {email.attempts} tentatives
                            </Badge>
                          )}
                        </div>
                        {email.duration && (
                          <span>{email.duration}ms</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
          
          {/* Email Details */}
          <div className="lg:col-span-1">
            {selectedEmail ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Détails de l'email</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" title="Voir le contenu">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Dupliquer">
                        <Copy className="h-4 w-4" />
                      </Button>
                      {selectedEmail.status === 'failed' && (
                        <Button variant="ghost" size="sm" title="Renvoyer">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Statut:</span>
                        <StatusBadge status={selectedEmail.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Compte:</span>
                        <span>{getAccount(selectedEmail.accountId)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tentatives:</span>
                        <span>{selectedEmail.attempts}</span>
                      </div>
                      {selectedEmail.duration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durée:</span>
                          <span>{selectedEmail.duration}ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Destinataires</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">À: </span>
                        <span>{selectedEmail.to.join(', ')}</span>
                      </div>
                      {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">CC: </span>
                          <span>{selectedEmail.cc.join(', ')}</span>
                        </div>
                      )}
                      {selectedEmail.bcc && selectedEmail.bcc.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">BCC: </span>
                          <span>{selectedEmail.bcc.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedEmail.errorMessage && (
                    <div>
                      <h4 className="font-medium mb-2 text-destructive">Erreur</h4>
                      <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                        {selectedEmail.errorMessage}
                      </p>
                    </div>
                  )}
                  
                  {selectedEmail.variables && Object.keys(selectedEmail.variables).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Variables utilisées</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(selectedEmail.variables).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground font-mono">{`{${key}}:`}</span>
                            <span className="truncate ml-2">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Pièces jointes</h4>
                      <div className="space-y-1 text-sm">
                        {selectedEmail.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex justify-between">
                            <span className="truncate">{attachment.name}</span>
                            <Badge variant="outline">
                              {(attachment.size / 1024 / 1024).toFixed(1)} MB
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez un email pour voir ses détails
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}