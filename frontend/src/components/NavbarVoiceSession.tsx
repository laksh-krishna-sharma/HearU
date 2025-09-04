import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { startVoiceSession, voiceTurn, voiceEnd, resetEveState, clearError } from '@/store/slices/eveSlice';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { Mic, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

const NavbarVoiceSession: React.FC = () => {
  const dispatch = useAppDispatch();
  const eveState = useAppSelector((state) => state.eve);
  const { session, turns, loading: eveLoading } = eveState;

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Audio playbook effect - same logic as JournalEditor
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
        if (isIntro) {
          setIsIntroPlaying(true);
        }
      };
      
      audioPlayer.onended = () => {
        setIsPlaying(false);
        if (isIntro) {
          setIsIntroPlaying(false);
          toast.success("Ready to record! Click the microphone to start sharing.");
        }
      };
      
      audioPlayer.onerror = () => {
        toast.error('Could not play audio response.');
        setIsPlaying(false);
        if (isIntro) {
          setIsIntroPlaying(false);
        }
      };
      
      audioPlayer.play().catch(() => {
        toast.error("Audio playback was blocked by the browser.");
        setIsPlaying(false);
        if (isIntro) {
          setIsIntroPlaying(false);
        }
      });
    };

    // Play audio for voice session only (no journal reply mode in navbar)
    if (session) {
      if (session.greeting_audio_path && turns.length === 0) {
        // Play intro greeting when session starts (no turns yet)
        playAudio(session.greeting_audio_path, true);
      } else {
        const lastTurn = turns.at(-1);
        if (lastTurn?.audio_path) {
          // Play latest response from voice turn
          playAudio(lastTurn.audio_path, false);
        }
      }
    }
  }, [session?.greeting_audio_path, session, turns]);

  // Cleanup effect on unmount
  useEffect(() => {
    return () => {
      const currentSession = session?.session_id;
      if (currentSession) {
        dispatch(voiceEnd({ session_id: currentSession, save_summary: false }));
      }
      dispatch(resetEveState());
    };
  }, [dispatch, session?.session_id]);

  const handleStartSession = async () => {
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

  const handleStartRecording = async () => {
    // Don't allow recording if session doesn't exist, already recording, or intro is still playing
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

  const handleEndSession = async () => {
    if (session?.session_id) {
      try {
        toast.loading("Ending voice session...");
        await dispatch(voiceEnd({ 
          session_id: session.session_id, 
          save_summary: false 
        })).unwrap();
        toast.dismiss();
        toast.success("Voice session ended.");
      } catch {
        toast.dismiss();
        toast.error("Failed to end session properly.");
      }
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  // If no session, show the default Eve icon that starts session
  if (!session) {
    return (
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
        <div className="w-[20rem] md:w-[30rem] h-10 md:h-12 bg-[#eae9e2] rounded-full flex items-center justify-center border">
          <button
            onClick={handleStartSession}
            disabled={eveLoading}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:scale-110 duration-200"
            style={{ 
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none'
            }}
          >
            <TbActivityHeartbeat className="h-16 w-16 text-[#0b132b]" />
          </button>
        </div>
      </div>
    );
  }

  // If session is active, show the expanded UI with mic and end call buttons
  return (
    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
      <div className="w-[20rem] md:w-[30rem] h-10 md:h-12 bg-[#eae9e2] rounded-full flex items-center justify-between px-4 border">
        {/* Left - Eve icon (smaller) */}
        <div className="flex items-center">
          <TbActivityHeartbeat className="h-8 w-8 text-[#0b132b]" />
        </div>

        {/* Center - Mic button */}
        <div 
          onClick={handleRecordClick}
          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors
            ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200 hover:bg-gray-300'}
            ${isPlaying ? 'bg-blue-300' : ''}
            ${!session || isPlaying || isIntroPlaying ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <Mic className="h-6 w-6 text-black" />
        </div>

        {/* Right - End call button */}
        <div
          onClick={handleEndSession}
          className={`w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center cursor-pointer transition-colors ${
            eveLoading || isRecording || isIntroPlaying ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <PhoneOff className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Status indicators */}
      {isIntroPlaying && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-md shadow-lg border">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-blue-600">Eve is introducing herself...</p>
          </div>
        </div>
      )}
      
      {isRecording && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-md shadow-lg border">
          <p className="text-xs text-red-600">Recording... Tap mic to stop.</p>
        </div>
      )}
      
      {isPlaying && !isIntroPlaying && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-md shadow-lg border">
          <p className="text-xs text-blue-600">Eve is responding...</p>
        </div>
      )}
    </div>
  );
};

export default NavbarVoiceSession;