import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { createJournalEntry, updateJournal, deleteJournal, getJournal } from '@/store/slices/journalSlice';
import { getJournalReply, startVoiceSession, voiceTurn, voiceEnd, resetEveState, clearJournalReply, clearError, getVoiceSessionResponsesUsingJournalId, deleteVoiceSessionResponse } from '@/store/slices/eveSlice';
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
  
  const { session, turns, journalReply, loading: eveLoading, voiceSessionResponses, isJournalReplyMode } = eveState;

  const { id } = useParams();
  const isEditing = !!id && id !== 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [journalNotFound, setJournalNotFound] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const fetchJournalData = async () => {
        try {
          const result = await dispatch(getJournal(id)).unwrap();
          setTitle(result.title || '');
          setContent(result.content || '');
          setTags(result.tags || []);
          setJournalNotFound(false);
          await dispatch(getVoiceSessionResponsesUsingJournalId(id)).unwrap();
        } catch (err: unknown) {
          console.error('Failed to load journal data:', err);
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
      fetchJournalData();
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setJournalNotFound(false);
    }
  }, [isEditing, id, dispatch, navigate]);

  useEffect(() => {
    const playAudio = (audioPath: string, isIntro: boolean = false) => {
      if (!audioPath) return;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audioPlayer = new Audio(audioPath);
      audioPlayerRef.current = audioPlayer;
      
      audioPlayer.onplay = () => {
        setIsPlaying(true);
        if (isIntro) setIsIntroPlaying(true);
      };
      
      audioPlayer.onended = () => {
        setIsPlaying(false);
        if (isIntro) {
          setIsIntroPlaying(false);
          toast.success("Ready to record! Click the microphone to start sharing.");
        } else if (isJournalReplyMode) {
          setTimeout(() => {
            dispatch(clearJournalReply());
          }, 1000);
        }
      };
      
      audioPlayer.onerror = () => {
        toast.error('Could not play audio response.');
        setIsPlaying(false);
        if (isIntro) setIsIntroPlaying(false);
      };
      
      audioPlayer.play().catch(() => {
        toast.error("Audio playback was blocked by the browser.");
        setIsPlaying(false);
        if (isIntro) setIsIntroPlaying(false);
      });
    };

    if (isJournalReplyMode && journalReply?.audio_path) {
      playAudio(journalReply.audio_path, false);
    } else if (session && !isJournalReplyMode) {
      if (session.greeting_audio_path && turns.length === 0) {
        playAudio(session.greeting_audio_path, true);
      } else {
        const lastTurn = turns.at(-1);
        if (lastTurn?.audio_path) {
          playAudio(lastTurn.audio_path, false);
        }
      }
    }
  }, [session?.greeting_audio_path, session, journalReply, turns, isJournalReplyMode, dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      // Only cleanup state, don't automatically end sessions
      dispatch(resetEveState());
    };
  }, [dispatch]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }
    
    setIsSaving(true);
    const entry = { title, content, tags, entryDate: new Date().toISOString() };
    
    try {
      if (isEditing && id) {
        await dispatch(updateJournal({ journal_id: id, entry })).unwrap();
        toast.success('Journal updated successfully!');
      } else {
        const newJournal = await dispatch(createJournalEntry(entry)).unwrap();
        toast.success('Journal created successfully!');
        navigate(`/journal/${newJournal.id}`);
        return; 
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
    if (!window.confirm('Are you sure you want to delete this journal?')) return;
    try {
      await dispatch(deleteJournal(id)).unwrap();
      toast.success('Journal deleted successfully!');
      navigate('/journal');
    } catch {
      toast.error('Failed to delete journal');
    }
  };

  const handleGetJournalReply = async () => {
    if (!isEditing || !id) {
      toast.error('Please save the journal before getting an AI reply.');
      return;
    }
    if (session) {
      dispatch(resetEveState());
    }
    toast.loading('Getting AI reply...');
    try {
      await dispatch(getJournalReply(id)).unwrap();
      toast.dismiss();
      toast.success('AI reply is playing.');
    } catch {
      toast.dismiss();
      toast.error('Failed to get AI reply.');
    }
  };
  
  const handleStartRecording = async () => {
    if (!session || isRecording || isIntroPlaying) {
      if (isIntroPlaying) {
        toast("Please wait for Eve to finish speaking before recording.");
      }
      return;
    }
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
            toast.loading("Processing your message...");
            await dispatch(voiceTurn({ session_id: session.session_id, audio: audioBlob })).unwrap();
            toast.dismiss();
            toast.success("Eve is responding...");
          }
        } catch {
          toast.dismiss();
          toast.error("Could not process your request.");
        }
      };
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast('Recording... Tap mic again to stop.');
  
    } catch {
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
    if (journalReply) {
      dispatch(clearJournalReply());
    }
    dispatch(clearError());
    const system_prompt = `You are Eve, a confidential, non-judgmental, and empathetic mental wellness companion designed specifically for Indian youth dealing with mental health challenges. You provide a safe, non-judgmental space for users to express their thoughts and feelings. Be empathetic, supportive, and culturally sensitive. Ask thoughtful follow-up questions and provide gentle guidance when appropriate. Keep responses conversational and warm.`;
    try {
      toast.loading("Starting voice session...");
      await dispatch(startVoiceSession(system_prompt)).unwrap();
      toast.dismiss();
      toast.success("Voice session started! Listen to Eve's introduction.");
    } catch {
      toast.dismiss();
      toast.error("Failed to start voice session.");
    }
  };
  
  const handleEndSession = async () => {
    if (session?.session_id) {
      setShowSaveModal(true);
    }
  };

  const handleConfirmEndSession = async (save_summary: boolean) => {
    setShowSaveModal(false);
    if (session?.session_id) {
      try {
        toast.loading("Ending voice session...");
        const endSessionPayload: { session_id: string; save_summary: boolean; journal_id?: string } = { 
          session_id: session.session_id, 
          save_summary 
        };
        if (save_summary && id && isEditing) {
          endSessionPayload.journal_id = id;
        }
        await dispatch(voiceEnd(endSessionPayload)).unwrap();
        toast.dismiss();
        if (save_summary) {
          toast.success("Session ended and summary saved! Check the notes panel.");
          if (id && isEditing) {
            // Refresh voice session responses after a short delay
            setTimeout(async () => {
              try {
                await dispatch(getVoiceSessionResponsesUsingJournalId(id));
              } catch (error) {
                console.error('Failed to refresh voice session responses:', error);
              }
            }, 1000);
          }
        } else {
          toast.success("Voice session ended.");
        }
      } catch {
        toast.dismiss();
        toast.error("Failed to end session properly.");
      }
    }
  };
    
  const handleDeleteVoiceSummary = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this voice summary?')) {
      try {
        toast.loading('Deleting summary...');
        await dispatch(deleteVoiceSessionResponse(sessionId)).unwrap();
        toast.dismiss();
        toast.success('Summary deleted.');
      } catch (deleteError) {
        toast.dismiss();
        toast.error('Failed to delete summary.');
        console.error('Failed to delete voice summary:', deleteError);
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
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
    <div className="min-h-screen w-screen p-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor - larger left side */}
          <div className="lg:col-span-2">
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
          </div>

          {/* Right column - stacked Notes and Voice Assistant */}
          <div className="flex flex-col gap-6">
            <NotesPanel 
              voiceSummaries={voiceSessionResponses}
              onDeleteSummary={handleDeleteVoiceSummary}
            />

            <VoiceAssistantPanel
              session={session}
              isRecording={isRecording}
              isPlaying={isPlaying}
              eveLoading={eveLoading}
              isJournalReplyMode={isJournalReplyMode}
              isIntroPlaying={isIntroPlaying}
              turns={turns}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
            />
          </div>
        </div>

        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">End Voice Session</h3>
              <p className="text-gray-600 mb-6">
                Do you want to save a summary of this conversation to this journal entry?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => handleConfirmEndSession(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  No, just end session
                </button>
                <button
                  onClick={() => handleConfirmEndSession(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Yes, save summary
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalEditor;
