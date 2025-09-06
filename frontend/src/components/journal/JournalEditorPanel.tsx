import React from 'react'; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface EditorPanelProps {
  title: string;
  content: string;
  tags: string[];
  tagInput: string;
  isEditing: boolean;
  isPlaying: boolean;
  eveLoading: boolean;
  isSaving: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent) => void;
  onRemoveTag: (tag: string) => void;
  onGetJournalReply: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  title,
  content,
  tags,
  tagInput,
  isEditing,
  isPlaying,
  eveLoading,
  isSaving,
  onTitleChange,
  onContentChange,
  onTagInputChange,
  onTagInputKeyDown,
  onRemoveTag,
  onGetJournalReply
}) => {
  return (
    <div className="lg:col-span-2">
      <div className="h-full space-y-4 bg-black/60 border border-gray-500 rounded-lg shadow-md p-6">
        <Input 
          placeholder="Enter journal title..." 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          className="text-lg font-semibold" 
        />
        
        <Textarea 
          placeholder="Write your journal entry here..." 
          value={content} 
          onChange={(e) => onContentChange(e.target.value)} 
          className="min-h-96 resize-none" 
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-white mb-1">Tags</label>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="flex items-center gap-1 bg-black/80 border border-gray-500 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <button 
                  type="button" 
                  className="w-6 h-6 hover:text-red-500 p-1 flex items-center justify-center rounded-full" 
                  onClick={() => onRemoveTag(tag)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagInputKeyDown}
            className="mt-2 w-full border border-gray-500 bg-black/80 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onGetJournalReply} 
            className="flex items-center gap-2 border-gray-500 bg-black/80 text-white shadow-sm"
            disabled={!isEditing || eveLoading || isSaving || isPlaying}
          >
            <Bot className="h-4 w-4" />
            {isPlaying ? 'Playing...' : 'Get AI Reply'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
