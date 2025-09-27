import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NotificationSettings } from '../types';
import { Navigate } from 'react-router-dom';

interface SettingsToggleProps {
  label: string;
  description: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  showSaved: boolean;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, isChecked, onChange, showSaved }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 pr-4">
        <h3 className="text-white font-semibold">{label}</h3>
        <p className="text-sm text-brand-text-muted">{description}</p>
      </div>
      <div className="flex items-center gap-3">
         <span className={`text-xs font-bold text-brand-accent transition-opacity duration-300 ${showSaved ? 'opacity-100' : 'opacity-0'}`}>
            Saved!
        </span>
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-surface ${
            isChecked ? 'bg-brand-interactive' : 'bg-brand-border'
          }`}
          onClick={() => onChange(!isChecked)}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
    const { currentUser, updateNotificationSettings } = useAuth();
    const [settings, setSettings] = useState<NotificationSettings | null>(currentUser?.notificationSettings || null);
    const [recentlySaved, setRecentlySaved] = useState<string | null>(null);

    useEffect(() => {
        if(currentUser?.notificationSettings) {
            setSettings(currentUser.notificationSettings);
        }
    }, [currentUser]);

    if (!currentUser || !settings) {
        return <Navigate to="/login" replace />;
    }

    const handleSettingChange = (category: 'inApp' | 'email', key: string, value: boolean) => {
        const newSettings = {
            ...settings,
            [category]: {
                ...settings[category],
                [key]: value,
            },
        };
        // The type assertion is needed because 'welcome' is not a key on the email settings.
        setSettings(newSettings as NotificationSettings);
        updateNotificationSettings(newSettings as NotificationSettings);
        
        const savedKey = `${category}-${key}`;
        setRecentlySaved(savedKey);
        setTimeout(() => setRecentlySaved(null), 1500);
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-brand-accent mb-2">Settings</h1>
            <p className="text-lg text-brand-text-muted mb-8">Manage your notification and account preferences.</p>

            <div className="bg-brand-surface p-6 sm:p-8 rounded-xl shadow-lg border border-brand-border/50">
                <h2 className="text-2xl font-semibold text-white border-b border-brand-border/50 pb-4">In-App Notifications</h2>
                <div className="divide-y divide-brand-border/50">
                    <SettingsToggle 
                        label="New Reactions"
                        description="Get notified when someone reacts to your post."
                        isChecked={settings.inApp.new_reaction}
                        onChange={(val) => handleSettingChange('inApp', 'new_reaction', val)}
                        showSaved={recentlySaved === 'inApp-new_reaction'}
                    />
                     <SettingsToggle 
                        label="New Comments"
                        description="Get notified when someone comments on your post."
                        isChecked={settings.inApp.new_comment}
                        onChange={(val) => handleSettingChange('inApp', 'new_comment', val)}
                        showSaved={recentlySaved === 'inApp-new_comment'}
                    />
                    <SettingsToggle 
                        label="Quest Completions"
                        description="Get notified when you complete a quest."
                        isChecked={settings.inApp.quest_complete}
                        onChange={(val) => handleSettingChange('inApp', 'quest_complete', val)}
                        showSaved={recentlySaved === 'inApp-quest_complete'}
                    />
                </div>
            </div>

            <div className="bg-brand-surface p-6 sm:p-8 rounded-xl shadow-lg border border-brand-border/50 mt-8">
                <h2 className="text-2xl font-semibold text-white border-b border-brand-border/50 pb-4">Email Notifications</h2>
                <div className="divide-y divide-brand-border/50">
                    <SettingsToggle 
                        label="New Reactions"
                        description="Receive an email when someone reacts to your post."
                        isChecked={settings.email.new_reaction}
                        onChange={(val) => handleSettingChange('email', 'new_reaction', val)}
                        showSaved={recentlySaved === 'email-new_reaction'}
                    />
                     <SettingsToggle 
                        label="New Comments"
                        description="Receive an email when someone comments on your post."
                        isChecked={settings.email.new_comment}
                        onChange={(val) => handleSettingChange('email', 'new_comment', val)}
                        showSaved={recentlySaved === 'email-new_comment'}
                    />
                    <SettingsToggle 
                        label="Quest Completions"
                        description="Receive an email when you complete a quest."
                        isChecked={settings.email.quest_complete}
                        onChange={(val) => handleSettingChange('email', 'quest_complete', val)}
                        showSaved={recentlySaved === 'email-quest_complete'}
                    />
                </div>
            </div>
        </div>
    );
};