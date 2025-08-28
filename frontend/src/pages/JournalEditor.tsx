import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  Save, 
  Mic, 
  Bot,
  ArrowLeft
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { createJournalEntry, updateJournal, deleteJournal, getJournal } from '@/store/slices/journalSlice';
import toast from 'react-hot-toast';
// --- MODIFICATION: Import new actions from eveSlice ---
import { getJournalReply, startVoiceSession, voiceTurn, voiceEnd, resetEveState } from '@/store/slices/eveSlice';

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
  // --- MODIFICATION: Get state from the eve slice ---
  const { session, turns, journalReply, loading: eveLoading, error: eveError } = useAppSelector((state) => state.eve);

  const { id } = useParams();
  const isEditing = id !== 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [journalNotFound, setJournalNotFound] = useState(false);

  // --- MODIFICATION: Add state and refs for audio handling ---
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

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
      setTitle('');
      setContent('');
      setTags([]);
      setJournalNotFound(false);
    }
  }, [isEditing, id, dispatch, navigate]);

  // --- MODIFICATION: useEffect to play audio from AI responses ---
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const playAudio = (audioPath: string) => {
      const audioUrl = audioPath.startsWith('http') ? audioPath : `${API_URL}/${audioPath}`;
      
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      
      const audioPlayer = new Audio(audioUrl);
      audioPlayerRef.current = audioPlayer;
  
      audioPlayer.onplay = () => setIsPlaying(true);
      audioPlayer.onended = () => setIsPlaying(false);
      audioPlayer.onerror = () => {
        toast.error('Could not play audio response.');
        setIsPlaying(false);
      };
  
      audioPlayer.play().catch(() => {
          toast.error("Audio playback was blocked by the browser.");
          setIsPlaying(false);
      });
    };
  
    if (journalReply?.audio_path) {
      playAudio(journalReply.audio_path);
    }
    
    const lastTurn = turns.length > 0 ? turns[turns.length - 1] : null;
    if (lastTurn?.audio_path) {
      playAudio(lastTurn.audio_path);
    }
  
  }, [journalReply, turns]);

  // --- MODIFICATION: useEffect for cleaning up the voice session on component unmount ---
  useEffect(() => {
    return () => {
      if (session?.session_id) {
        dispatch(voiceEnd({ session_id: session.session_id, save_summary: false }));
      }
      dispatch(resetEveState());
    };
  }, [session, dispatch]);
  
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
      entryDate: new Date().toISOString()
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

  // --- MODIFICATION: Request 1 - Get AI audio reply for the current journal entry ---
  const handleGetJournalReply = async () => {
    if (!isEditing || !id) {
      toast.error('Please save the journal before getting an AI reply.');
      return;
    }
    toast.loading('Getting AI reply...');
    try {
      await dispatch(getJournalReply(id)).unwrap();
      toast.dismiss();
      toast.success('AI reply is playing.');
    } catch (error) {
      toast.dismiss();
      console.error('Failed to get journal reply:', error);
    }
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // --- MODIFICATION: Request 2 - Voice Assistant Functions ---
  const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
  };
  
  const handleStartRecording = async () => {
    if (!session || isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
  
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        try {
          const audioBase64 = await blobToBase64(audioBlob);
          if (session?.session_id) {
              toast.loading("Thinking...");
              await dispatch(voiceTurn({ session_id: session.session_id, audio: audioBase64 })).unwrap();
              toast.dismiss();
          }
        } catch (err) {
          toast.dismiss();
          toast.error("Could not process your request.");
        }
      };
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast('Recording...', { icon: '🎤' });
  
    } catch (err) {
      toast.error("Microphone access denied.");
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.dismiss();
    }
  };
  
  const handleStartSession = () => {
      const system_prompt = "You are Eve, a supportive and insightful journaling assistant. Your role is to listen to the user, ask clarifying questions, and offer gentle guidance. You should sound empathetic and encouraging.";
      dispatch(startVoiceSession(system_prompt));
      toast.success("Voice session started!");
  };
  
  const handleEndSession = () => {
      if (session?.session_id) {
          const save_summary = window.confirm("Do you want to save a summary of this conversation to a new journal entry?");
          dispatch(voiceEnd({ session_id: session.session_id, save_summary }));
          toast.success("Voice session ended.");
      }
  };

  if (journalNotFound) {
    return (
      <div className="min-h-screen bg-ocean-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate('/journal')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Journals
            </Button>
          </div>
          <div className="text-center p-16">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Journal Not Found</h2>
            <p className="text-gray-600">The journal you're trying to access doesn't exist.</p>
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
            <Button variant="outline" onClick={() => navigate('/journal')} className="flex items-center gap-2 text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {/* --- FIX: Corrected logic for title --- */}
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
              {/* --- FIX: Corrected logic for button text --- */}
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
          <div className="lg:col-span-1 hover:shadow-lg">
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
          <div className="lg:col-span-2 hover:shadow-lg">
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
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-ocean-primary text-black px-2 py-1 rounded-full text-sm">
                        {tag}
                        <button 
                          type="button" 
                          className="w-6 h-6 hover:text-gray-200 p-1" 
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
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
                {/* --- MODIFICATION: Updated button for Request 1 --- */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGetJournalReply} 
                    className="flex items-center gap-2"
                    disabled={!isEditing || eveLoading || isSaving || isPlaying}
                  >
                    <Bot className="h-4 w-4" />
                    {isPlaying ? 'Playing...' : 'Get AI Reply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- MODIFICATION: Right Column - AI Assistant (Dynamic UI) --- */}
          <div className="lg:col-span-1 flex flex-col hover:shadow-lg">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mic className="h-4 w-4" /> Voice Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                {session ? (
                  <div className="text-center space-y-4">
                    <div 
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors
                        ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200 hover:bg-gray-300'}
                        ${isPlaying ? 'bg-blue-300' : ''}
                        ${!session || isPlaying ? 'cursor-not-allowed opacity-50' : ''}
                      `}
                    >
                      <Mic className="h-10 w-10 text-black" />
                    </div>
                    {isRecording && <p className="text-sm text-gray-600">Recording... Tap mic to stop.</p>}
                    {isPlaying && <p className="text-sm text-gray-600">Playing response...</p>}
                    {!isRecording && !isPlaying && <p className="text-sm text-gray-600">Tap mic to speak.</p>}
                    
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={handleEndSession}
                      disabled={eveLoading || isRecording}
                    >
                      End Session
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <Bot className="h-10 w-10 text-black" />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleStartSession}
                      disabled={eveLoading}
                    >
                      {eveLoading ? 'Starting...' : 'Start Voice Session'}
                    </Button>
                    <p className="text-xs text-gray-500">Start a conversation with your AI assistant.</p>
                  </div>
                )}
                {eveError && <p className="text-xs text-red-500 mt-2">Error: {typeof eveError === 'string' ? eveError : 'An assistant error occurred.'}</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;