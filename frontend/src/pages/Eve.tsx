import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { startVoiceSession, voiceTurn, voiceEnd, resetEveState, clearError } from '@/store/slices/eveSlice';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { Mic, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Eve: React.FC = () => {
  const dispatch = useAppDispatch();
  const eveState = useAppSelector((state) => state.eve);
  const { session, turns, loading: eveLoading } = eveState;

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Audio playback effect
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

    // Play audio for voice session
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
      // Only cleanup state, don't automatically end sessions
      dispatch(resetEveState());
    };
  }, [dispatch]);

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

  const handleEveClick = () => {
    if (!session) {
      handleStartSession();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center text-white relative">
      {/* Center Orb */}
      <div className="flex flex-1 items-center justify-center">
        <div 
          onClick={handleEveClick}
          className={`w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-black shadow-lg shadow-blue-500/40 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 ${
            eveLoading ? 'animate-pulse' : ''
          } ${
            isPlaying ? 'shadow-blue-400/60 animate-pulse' : ''
          }`}
        >
          <TbActivityHeartbeat className="w-20 h-20 text-white" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center mb-28">
        {/* Controls - Only show when session is active */}
        {session && (
          <div className="flex items-center gap-6 mb-4">
            <button 
              onClick={handleRecordClick}
              disabled={!session || isPlaying || isIntroPlaying}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-[#2f2f2f] hover:bg-[#3a3a3a]'
              } ${
                !session || isPlaying || isIntroPlaying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Mic className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={handleEndSession}
              disabled={eveLoading || isRecording || isIntroPlaying}
              className={`w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors ${
                eveLoading || isRecording || isIntroPlaying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {/* Status Messages */}
        <div className="text-sm text-white text-center">
          {!session && "Click on Eve to start a conversation"}
          {session && isIntroPlaying && "Eve is introducing herself..."}
          {session && isRecording && "Recording... Click mic to stop"}
          {session && isPlaying && !isIntroPlaying && "Eve is responding..."}
          {session && !isRecording && !isPlaying && !isIntroPlaying && "Click mic to share your thoughts"}
        </div>

        {/* Subtitle */}
        <div className="text-lg text-white mt-2 font-semibold">Hello, I'm Eve</div>
      </div>
    </div>
  );
};

export default Eve;