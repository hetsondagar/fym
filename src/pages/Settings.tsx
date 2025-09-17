import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Eye, Users, Lock, Unlock, Save, User, Mail, Key, Palette, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { userAPI } from '@/lib/api';
import { User as UserType, UserSettings } from '@/lib/types';
import Navbar from '@/components/Navbar';

const Settings = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      watchlistUpdates: true,
      friendActivity: true
    },
    privacy: {
      profilePublic: true,
      watchlistPublic: true,
      reviewsPublic: true
    },
    familyMode: {
      enabled: false,
      restrictions: [],
      approvalRequired: false
    }
  });
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setSettings(currentUser.settings || settings);
      setProfileData({
        username: currentUser.username,
        email: currentUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, []);

  const handleSettingsChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof UserSettings],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    if (!user) return;
    
    try {
      const users = JSON.parse(localStorage.getItem('fym_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].settings = settings;
        users[userIndex].username = profileData.username;
        users[userIndex].email = profileData.email;
        
        if (profileData.newPassword && profileData.newPassword === profileData.confirmPassword) {
          users[userIndex].password = profileData.newPassword;
        }
        
        localStorage.setItem('fym_users', JSON.stringify(users));
        localStorage.setItem('fym_current_user', JSON.stringify(users[userIndex]));
        setUser(users[userIndex]);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const addRestriction = (restriction: string) => {
    if (!settings.familyMode.restrictions.includes(restriction)) {
      handleSettingsChange('familyMode', 'restrictions', [...settings.familyMode.restrictions, restriction]);
    }
  };

  const removeRestriction = (restriction: string) => {
    handleSettingsChange('familyMode', 'restrictions', 
      settings.familyMode.restrictions.filter(r => r !== restriction)
    );
  };

  const restrictionOptions = [
    'No R-rated content',
    'No violence',
    'No profanity',
    'No sexual content',
    'No horror movies',
    'No mature themes',
    'Educational content only',
    'Family-friendly only'
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Please sign in</h2>
            <p className="text-muted-foreground">You need to be signed in to access settings.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-r from-cinema-black via-cinema-dark to-cinema-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <SettingsIcon className="h-12 w-12 text-cinema-gold" />
                <h1 className="heading-hero text-4xl md:text-5xl">Settings</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Customize your fym experience. Manage your profile, privacy settings, notifications, and family controls.
              </p>
            </div>
          </div>
        </section>

        {/* Settings Content */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-cinema-dark border-cinema-gold/30">
                <TabsTrigger value="profile" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="privacy" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="notifications" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="family" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Family Mode
                </TabsTrigger>
                <TabsTrigger value="appearance" className="text-foreground data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-black">
                  Appearance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-8">
                <Card className="bg-cinema-dark border-cinema-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-cinema-gold" />
                      <span>Profile Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username" className="text-foreground">Username</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => handleProfileChange('username', e.target.value)}
                          className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                        />
                      </div>
                    </div>

                    <Separator className="bg-cinema-red/20" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={profileData.currentPassword}
                            onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                            className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                            className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                            className="bg-cinema-black/50 border-cinema-gold/30 focus:border-cinema-gold"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-8">
                <Card className="bg-cinema-dark border-cinema-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-cinema-gold" />
                      <span>Privacy Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Public Profile</h3>
                          <p className="text-sm text-muted-foreground">Allow others to see your profile information</p>
                        </div>
                        <Switch
                          checked={settings.privacy.profilePublic}
                          onCheckedChange={(checked) => handleSettingsChange('privacy', 'profilePublic', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Public Watchlist</h3>
                          <p className="text-sm text-muted-foreground">Allow others to see your watchlist</p>
                        </div>
                        <Switch
                          checked={settings.privacy.watchlistPublic}
                          onCheckedChange={(checked) => handleSettingsChange('privacy', 'watchlistPublic', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Public Reviews</h3>
                          <p className="text-sm text-muted-foreground">Allow others to see your reviews and ratings</p>
                        </div>
                        <Switch
                          checked={settings.privacy.reviewsPublic}
                          onCheckedChange={(checked) => handleSettingsChange('privacy', 'reviewsPublic', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-8">
                <Card className="bg-cinema-dark border-cinema-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-cinema-gold" />
                      <span>Notification Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => handleSettingsChange('notifications', 'email', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Push Notifications</h3>
                          <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                        </div>
                        <Switch
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) => handleSettingsChange('notifications', 'push', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Watchlist Updates</h3>
                          <p className="text-sm text-muted-foreground">Get notified when friends update their watchlists</p>
                        </div>
                        <Switch
                          checked={settings.notifications.watchlistUpdates}
                          onCheckedChange={(checked) => handleSettingsChange('notifications', 'watchlistUpdates', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Friend Activity</h3>
                          <p className="text-sm text-muted-foreground">Get notified about your friends' movie activities</p>
                        </div>
                        <Switch
                          checked={settings.notifications.friendActivity}
                          onCheckedChange={(checked) => handleSettingsChange('notifications', 'friendActivity', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="family" className="mt-8">
                <Card className="bg-cinema-dark border-cinema-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-cinema-gold" />
                      <span>Family Mode</span>
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Set up parental controls and content restrictions for family viewing
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Enable Family Mode</h3>
                          <p className="text-sm text-muted-foreground">Activate parental controls and content filtering</p>
                        </div>
                        <Switch
                          checked={settings.familyMode.enabled}
                          onCheckedChange={(checked) => handleSettingsChange('familyMode', 'enabled', checked)}
                        />
                      </div>

                      {settings.familyMode.enabled && (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">Approval Required</h3>
                              <p className="text-sm text-muted-foreground">Require approval for adding new content to watchlists</p>
                            </div>
                            <Switch
                              checked={settings.familyMode.approvalRequired}
                              onCheckedChange={(checked) => handleSettingsChange('familyMode', 'approvalRequired', checked)}
                            />
                          </div>

                          <Separator className="bg-cinema-red/20" />

                          <div>
                            <h3 className="font-medium text-foreground mb-4">Content Restrictions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {restrictionOptions.map((restriction) => (
                                <div
                                  key={restriction}
                                  className={`flex items-center justify-between p-3 rounded border transition-colors ${
                                    settings.familyMode.restrictions.includes(restriction)
                                      ? 'bg-cinema-red/20 border-cinema-red/50'
                                      : 'bg-cinema-black/50 border-cinema-gold/30 hover:bg-cinema-black/70'
                                  }`}
                                >
                                  <span className="text-sm text-foreground">{restriction}</span>
                                  <Switch
                                    checked={settings.familyMode.restrictions.includes(restriction)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        addRestriction(restriction);
                                      } else {
                                        removeRestriction(restriction);
                                      }
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="mt-8">
                <Card className="bg-cinema-dark border-cinema-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5 text-cinema-gold" />
                      <span>Appearance Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-foreground mb-2 block">Theme</Label>
                        <Select 
                          value={settings.theme} 
                          onValueChange={(value: 'dark' | 'light') => handleSettingsChange('theme', 'theme', value)}
                        >
                          <SelectTrigger className="bg-cinema-black/50 border-cinema-gold/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-cinema-dark border-cinema-gold/30">
                            <SelectItem value="dark" className="text-foreground">Dark Mode</SelectItem>
                            <SelectItem value="light" className="text-foreground">Light Mode</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            {hasChanges && (
              <div className="mt-8 flex justify-end">
                <Button onClick={saveSettings} className="btn-hero">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
