import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Palette, 
  Globe, 
  Clock, 
  Shield, 
  Database, 
  Zap,
  Save,
  RotateCcw,
  FileText,
  Folder,
  HardDrive,
  Info,
} from 'lucide-react';

export function SettingsPage() {
  const { settings, updateSettings, toggleTheme } = useAppStore();
  const { toast } = useToast();
  
  const [tempSettings, setTempSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    updateSettings(tempSettings);
    setHasChanges(false);
    toast({
      title: 'Paramètres sauvegardés',
      description: 'Vos préférences ont été mises à jour',
    });
  };
  
  const handleReset = () => {
    setTempSettings(settings);
    setHasChanges(false);
    toast({
      title: 'Modifications annulées',
      description: 'Les paramètres ont été restaurés',
    });
  };
  
  const handleBackup = () => {
    toast({
      title: 'Sauvegarde créée',
      description: 'Vos données ont été sauvegardées localement',
    });
  };
  
  const handleRestore = () => {
    toast({
      title: 'Restauration',
      description: 'Fonctionnalité de restauration (mockée)',
    });
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Configurez l'application selon vos préférences
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          )}
        </div>
        
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Général
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select 
                  value={tempSettings.theme} 
                  onValueChange={(value: any) => handleSettingChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white border rounded"></div>
                        Clair
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-900 rounded"></div>
                        Sombre
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Palette className="w-3 h-3" />
                        Système
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select 
                  value={tempSettings.language} 
                  onValueChange={(value: any) => handleSettingChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇫🇷</span>
                        Français
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇺🇸</span>
                        English
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Format de date</Label>
                <Select 
                  value={tempSettings.dateFormat} 
                  onValueChange={(value: any) => handleSettingChange('dateFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (FR)</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Taille max des pièces jointes</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {formatFileSize(tempSettings.maxAttachmentSize)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    (Non modifiable - défini par l'hébergeur)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sauvegarde automatique des brouillons</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarde automatiquement vos brouillons toutes les 30 secondes
                </p>
              </div>
              <Switch
                checked={tempSettings.autoSaveDrafts}
                onCheckedChange={(checked) => handleSettingChange('autoSaveDrafts', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Verrouillage au démarrage</Label>
                  <p className="text-sm text-muted-foreground">
                    Demander le mot de passe maître à l'ouverture de l'application
                  </p>
                </div>
                <Switch
                  checked={tempSettings.lockOnStartup}
                  onCheckedChange={(checked) => handleSettingChange('lockOnStartup', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mot de passe maître</Label>
                    <p className="text-sm text-muted-foreground">
                      Chiffre vos données sensibles localement
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {tempSettings.masterPassword ? (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Configuré
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Non configuré
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      {tempSettings.masterPassword ? 'Modifier' : 'Configurer'}
                    </Button>
                  </div>
                </div>
                
                {!tempSettings.masterPassword && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-warning" />
                      <span className="text-sm text-warning font-medium">
                        Recommandation sécurité
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configurez un mot de passe maître pour chiffrer vos mots de passe SMTP
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultThrottling">Throttling par défaut (emails/minute)</Label>
                <Input
                  id="defaultThrottling"
                  type="number"
                  value={tempSettings.defaultThrottling}
                  onChange={(e) => handleSettingChange('defaultThrottling', parseInt(e.target.value))}
                  min="1"
                  max="1000"
                />
                <p className="text-xs text-muted-foreground">
                  Limite d'envoi par défaut pour nouveaux comptes
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtpTimeout">Timeout SMTP (secondes)</Label>
                <Input
                  id="smtpTimeout"
                  type="number"
                  value={tempSettings.smtpTimeout}
                  onChange={(e) => handleSettingChange('smtpTimeout', parseInt(e.target.value))}
                  min="5"
                  max="300"
                />
                <p className="text-xs text-muted-foreground">
                  Temps d'attente maximum pour les tests SMTP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <Label>Base de données SQLite</Label>
                    <p className="text-sm text-muted-foreground">
                      ~/Velyorix/velyorix.db
                    </p>
                  </div>
                </div>
                <Badge variant="outline">2.3 MB</Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleBackup}>
                  <Database className="h-4 w-4 mr-2" />
                  Créer une sauvegarde
                </Button>
                <Button variant="outline" onClick={handleRestore}>
                  <Folder className="h-4 w-4 mr-2" />
                  Restaurer une sauvegarde
                </Button>
              </div>
              
              <div className="p-3 bg-info/10 border border-info/20 rounded">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-info" />
                  <span className="text-sm text-info font-medium">
                    Information
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Toutes vos données sont stockées localement sur votre machine. 
                  Aucune information n'est transmise à nos serveurs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Avancé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Paramètres SQLite PRAGMA</Label>
              <div className="bg-muted p-3 rounded font-mono text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">journal_mode:</span>
                  <span>WAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">synchronous:</span>
                  <span>NORMAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">foreign_keys:</span>
                  <span>ON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">cache_size:</span>
                  <span>-64000</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Paramètres de performance de la base de données (lecture seule)
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Actions */}
        {hasChanges && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Vous avez des modifications non sauvegardées
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Annuler
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Sauvegarder les modifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}