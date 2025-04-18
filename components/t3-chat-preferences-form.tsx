'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { saveUserPreferences } from '@/app/(chat)/actions';

interface T3ChatPreferencesFormProps {
  initialValues?: {
    chatName?: string;
    occupation?: string;
    traits?: string;
    additionalInfo?: string;
  };
}

export default function T3ChatPreferencesForm({ initialValues }: T3ChatPreferencesFormProps) {
  const [formState, setFormState] = useState({
    chatName: initialValues?.chatName || '',
    occupation: initialValues?.occupation || '',
    traits: initialValues?.traits || '',
    additionalInfo: initialValues?.additionalInfo || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage('');

    try {
      await saveUserPreferences(formState);
      setSavedMessage('Preferences saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSavedMessage('Error saving preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chatName">What should Boogle call you?</Label>
            <Input
              id="chatName"
              name="chatName"
              placeholder="Enter your name"
              value={formState.chatName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">What do you do?</Label>
            <Input
              id="occupation"
              name="occupation"
              placeholder="Engineer, student, etc."
              value={formState.occupation}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="traits">What traits should Boogle have?</Label>
            <Textarea
              id="traits"
              name="traits"
              placeholder="Enter traits separated by commas (e.g. Chatty, Witty, Opinionated)"
              value={formState.traits}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Anything else Boogle should know about you?</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              placeholder="Interests, values, or preferences to keep in mind"
              value={formState.additionalInfo}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
            {savedMessage && (
              <span className={savedMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}>
                {savedMessage}
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}