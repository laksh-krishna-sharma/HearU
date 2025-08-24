import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  Save, 
  Upload, 
  Mic, 
  Bot,
  ArrowLeft
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { createJournalEntry, updateJournal, deleteJournal, getJournal } from '@/store/slices/journalSlice';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

interface ApiError {
  status?: number;
  response?: {
    status: number;
    data?: unknown;
  };
} 

const JournalEditor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.journal);

  const { id } = useParams();
  const isEditing = id !== 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [journalNotFound, setJournalNotFound] = useState(false);

  const [noteshistory] = useState<ChatMessage[]>([
    { id: 'h1', content: 'How can I improve my writing?', sender: 'user', timestamp: '2024-01-14T10:30:00Z' },
    { id: 'h2', content: 'Here are some tips for better writing...', sender: 'assistant', timestamp: '2024-01-14T10:31:00Z' },
  ]);

  useEffect(() => {
    if (isEditing && id) {
      const fetchJournal = async () => {
        try {
          const result = await dispatch(getJournal(id)).unwrap();
          setTitle(result.title || '');
          setContent(result.content || '');
          setTags(result.tags || []);
          setJournalNotFound(false);
        } catch (err: unknown) {
          console.error('Failed to load journal:', err);
          const apiError = err as ApiError;
          if (apiError?.status === 404 || (apiError?.response && apiError.response.status === 404)) {
            setJournalNotFound(true);
            toast.error('Journal not found');
          } else if (apiError?.status === 401 || (apiError?.response && apiError.response.status === 401)) {
            toast.error('Session expired. Please log in again.');
            navigate('/login');
          } else {
            toast.error('Failed to load journal');
          }
        }
      };
      
      fetchJournal();
    } else {
      // Reset form for new entries
      setTitle('');
      setContent('');
      setTags([]);
      setJournalNotFound(false);
    }
  }, [isEditing, id, dispatch, navigate]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }
    
    setIsSaving(true);
    const entry = { 
      title, 
      content, 
      tags,
      entryDate: new Date().toISOString() // Keep as ISO string for consistency
    };
    
    try {
      if (isEditing && id) {
        await dispatch(updateJournal({ journal_id: id, entry })).unwrap();
        toast.success('Journal updated successfully!');
      } else {
        await dispatch(createJournalEntry(entry)).unwrap();
        toast.success('Journal created successfully!');
      }
      navigate('/journal');
    } catch (error: unknown) {
      console.error('Failed to save journal:', error);
      const apiError = error as ApiError;
      if (apiError?.status === 401 || (apiError?.response && apiError.response.status === 401)) {
        toast.error('Please log in again');
        navigate('/login');
      } else if (apiError?.status === 422 || (apiError?.response && apiError.response.status === 422)) {
        toast.error('Validation error. Please check your input.');
      } else {
        toast.error('Failed to save journal');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !id) return;
    
    if (!window.confirm('Are you sure you want to delete this journal?')) {
      return;
    }
    
    try {
      await dispatch(deleteJournal(id)).unwrap();
      toast.success('Journal deleted successfully!');
      navigate('/journal');
    } catch (error: unknown) {
      console.error('Failed to delete journal:', error);
      const apiError = error as ApiError;
      if (apiError?.status === 401 || (apiError?.response && apiError.response.status === 401)) {
        toast.error('Please log in again');
        navigate('/login');
      } else {
        toast.error('Failed to delete journal');
      }
    }
  };

  const handleUpload = () => {
    toast('File upload functionality coming soon!');
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  if (journalNotFound) {
    return (
      <div className="min-h-screen bg-ocean-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center">
            <Button variant="outline" onClick={() => navigate('/journal')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Journals
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Journal Not Found</h2>
              <p className="text-gray-600">The journal you're trying to access doesn't exist or may have been deleted.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/journal')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-ocean-text">{isEditing ? 'Edit Journal' : 'New Journal Entry'}</h1>
          </div>
          <div className="space-x-2 flex">
            {isEditing && (
              <Button variant="destructive" onClick={handleDelete} disabled={isSaving || loading}>
                Delete
              </Button>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isSaving || loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {typeof error === 'string' ? error : 'An error occurred'}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Notes */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader><CardTitle className="text-lg">Notes</CardTitle></CardHeader>
              <CardContent>
                <Tabs defaultValue="chat" className="w-full">
                  <TabsContent value="chat" className="mt-4">
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {noteshistory.map((msg) => (
                        <div key={msg.id} className="p-2 border rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            {msg.sender === 'user' ? (
                              <div className="w-2 h-2 bg-ocean-primary rounded-full" />
                            ) : (
                              <Bot className="h-3 w-3 text-ocean-secondary" />
                            )}
                            <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                          </div>
                          <p className="text-gray-700 line-clamp-2">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Journal Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader><CardTitle>Journal Content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Enter journal title..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="text-lg font-semibold" 
                />
                <Textarea 
                  placeholder="Write your journal entry here..." 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  className="min-h-96 resize-none" 
                />

                {/* Tags Input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-ocean-primary text-white px-2 py-1 rounded-full text-sm">
                        {tag}
                        <button 
                          type="button" 
                          className="text-white hover:text-gray-200" 
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim() !== '') {
                        e.preventDefault();
                        if (!tags.includes(tagInput.trim())) {
                          setTags([...tags, tagInput.trim()]);
                        }
                        setTagInput('');
                      }
                    }}
                    className="mt-2 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-primary"
                  />
                </div>

                {/* File Upload */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleUpload} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Assistant */}
          <div className="lg:col-span-1 flex flex-col">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mic className="h-4 w-4" /> Voice Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-ocean-primary rounded-full flex items-center justify-center">
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                  <Button variant="outline" className="w-full">Start Recording</Button>
                  <p className="text-xs text-gray-500">Tap to start voice conversation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;