import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

interface JournalHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  loading: boolean;
  onBack: () => void;
  onSave: () => void;
  onDelete?: () => void;
}

const JournalHeader: React.FC<JournalHeaderProps> = ({
  isEditing,
  isSaving,
  loading,
  onBack,
  onSave,
  onDelete
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-white">
          {isEditing ? 'Edit Journal' : 'New Journal Entry'}
        </h1>
      </div>
      <div className="space-x-2 flex">
        {isEditing && onDelete && (
          <Button variant="destructive" onClick={onDelete} disabled={isSaving || loading}>
            Delete
          </Button>
        )}
        <Button 
          onClick={onSave} 
          disabled={isSaving || loading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default JournalHeader;