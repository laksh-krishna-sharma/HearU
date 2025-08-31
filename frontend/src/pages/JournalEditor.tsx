import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { createJournalEntry, updateJournal, deleteJournal, getJournal } from '@/store/slices/journalSlice';
import { getJournalReply, startVoiceSession, voiceTurn, voiceEnd, resetEveState } from '@/store/slices/eveSlice';
import toast from 'react-hot-toast';
import JournalHeader from '../components/journal/JournalHeader';
import EditorPanel from '../components/journal/JournalEditorPanel';
import NotesPanel from '../components/journal/JournalNotesPanel';
import VoiceAssistantPanel from '../components/journal/VoiceAssistantPanel';
import ErrorDisplay from '../components/journal/ErrorDisplay';
import NotFoundView from '../components/journal/NotFoundView';

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
  const eveState = useAppSelector((state) => state.eve);
  const { session, turns, journalReply, loading: eveLoading, error: eveError } = eveState;
  
  // Debug logs (remove in production)
  // useEffect(() => {
  //   console.log("Full eve state:", eveState);
  // }, [eveState]);
  
  // useEffect(() => {
  //   console.log("Session state changed:", session);
  //   console.log("Session object keys:", session ? Object.keys(session) : 'null');
  //   console.log("Session session_id:", session?.session_id);
  // }, [session]);

  const { id } = useParams();
  const isEditing = !!id && id !== 'new';
  const isEditing = !!id && id !== 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [journalNotFound, setJournalNotFound] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Create voice summaries from endSummary state
  const voiceSummaries = eveState.endSummary ? [{
    id: eveState.endSummary.session_id,
    summary: eveState.endSummary.summary || '',
    notes_content: eveState.endSummary.notes_content || '',
    session_date: new Date().toISOString(), // Use current time as session end time
    session_id: eveState.endSummary.session_id
  }] : [];

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
  
    // Play greeting audio when session starts
    if (session?.greeting_audio_path) {
      playAudio(session.greeting_audio_path);
    }
    
    // Play journal reply audio
    if (journalReply?.audio_path) {
      playAudio(journalReply.audio_path);
    }
    
    // Play voice turn response audio
    const lastTurn = turns.length > 0 ? turns[turns.length - 1] : null;
    if (lastTurn?.audio_path) {
      playAudio(lastTurn.audio_path);
    }
  }, [session?.greeting_audio_path, journalReply, turns]);

  useEffect(() => {
    return () => {
      // Only cleanup when component unmounts, not when session changes
      if (session?.session_id) {
        dispatch(voiceEnd({ session_id: session.session_id, save_summary: false }));
      }
      dispatch(resetEveState());
    };
  }, []); // Remove session dependency to prevent cleanup on session changes
  
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
          if (session?.session_id) {
              toast.loading("Thinking...");
              // Send the Blob directly, not base64 string
              await dispatch(voiceTurn({ session_id: session.session_id, audio: audioBlob })).unwrap();
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
  
  const handleStartSession = async () => {
  const system_prompt = `
    You are Eve, a confidential, non-judgmental, and empathetic mental wellness companion designed for Gen Z users. Your primary goals are to listen actively, offer emotional support, and guide users toward safe, constructive next steps.  
    Your tone should be friendly, relatable, and encouraging while respecting the user's boundaries. Avoid overly formal or clinical language�speak like a supportive friend who understands Gen Z culture and lingo, but remain respectful and inclusive.  
    When giving advice, base it on evidence-based mental health practices, mindfulness techniques, and healthy coping strategies.  
    If a user expresses signs of self-harm, suicidal thoughts, or severe emotional distress, respond with compassion and encourage them to seek immediate professional help. Provide helpline numbers relevant to their country (if known).  
    Never give medical diagnoses, prescribe medication, or replace professional therapy. Instead, focus on emotional guidance, practical tips, and connecting them with helpful resources.  
    Always ensure the conversation is safe, private, and supportive.  
    You can also share light, uplifting content like affirmations, relatable anecdotes, and healthy productivity tips.  
    When discussing mental wellness topics, keep explanations simple, engaging, and easy to follow. Use short paragraphs and relatable examples.  
    Avoid generating audio responses longer than 2 minutes.
    `;
  
  try {
    toast.loading("Starting voice session...");
    const sessionResult = await dispatch(startVoiceSession(system_prompt)).unwrap();
    toast.dismiss();
    
    // console.log("Session result:", sessionResult);
    // console.log("Current session state (might be stale):", session);
    
    if (sessionResult.greeting_message) {
      toast.success("Eve says: " + sessionResult.greeting_message.substring(0, 50) + "...");
    } else {
      toast.success("Voice session started! Eve is ready to listen.");
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to start voice session. Please try again.");
    console.error("Voice session start error:", error);
  }
};

  
  const handleEndSession = async () => {
    if (session?.session_id) {
      const save_summary = window.confirm("Do you want to save a summary of this conversation to a new journal entry?");
      try {
        await dispatch(voiceEnd({ session_id: session.session_id, save_summary })).unwrap();
        if (save_summary) {
          toast.success("Voice session ended and summary saved!");
        } else {
          toast.success("Voice session ended.");
        }
      } catch (error) {
        toast.error("Failed to end session properly.");
        console.error("End session error:", error);
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (journalNotFound) {
    return <NotFoundView onBack={() => navigate('/journal')} />;
  }

  return (
    <div className="min-h-screen bg-ocean-background p-6">
      <div className="max-w-7xl mx-auto">
        <JournalHeader
          isEditing={isEditing}
          isSaving={isSaving}
          loading={loading}
          onBack={() => navigate('/journal')}
          onSave={handleSave}
          onDelete={isEditing ? handleDelete : undefined}
        />

        {error && <ErrorDisplay error={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <NotesPanel voiceSummaries={voiceSummaries} />
          
          <EditorPanel
            title={title}
            content={content}
            tags={tags}
            tagInput={tagInput}
            isEditing={isEditing}
            isPlaying={isPlaying}
            eveLoading={eveLoading}
            isSaving={isSaving}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onTagInputChange={setTagInput}
            onTagInputKeyDown={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onGetJournalReply={handleGetJournalReply}
          />

          <VoiceAssistantPanel
            session={session}
            isRecording={isRecording}
            isPlaying={isPlaying}
            eveLoading={eveLoading}
            eveError={eveError}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
          />
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;