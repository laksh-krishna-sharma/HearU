import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { TbActivityHeartbeat } from 'react-icons/tb';

interface VoiceAssistantPanelProps {
  session: unknown;
  isRecording: boolean;
  isPlaying: boolean;
  eveLoading: boolean;
  isJournalReplyMode: boolean;
  isIntroPlaying: boolean;
  turns: unknown[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onStartSession: () => void;
  onEndSession: () => void;
}

const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
  session,
  isRecording,
  isPlaying,
  eveLoading,
  isJournalReplyMode,
  isIntroPlaying,
  turns,
  onStartRecording,
  onStopRecording,
  onStartSession,
  onEndSession
}) => {
  return (
    <div className="lg:col-span-1 flex flex-col">
      <Card className="h-full flex flex-col bg-black/80 border border-gray-500 text-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-4 w-4 text-white" /> Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center overflow-hidden">

          {/* Active session & not in journal reply mode */}
          {session && !isJournalReplyMode ? (
            <div className="text-center space-y-4">
              <div
                onClick={isRecording ? onStopRecording : onStartRecording}
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors border border-gray-500
                  ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-black/80 hover:bg-gray-700'}
                  ${isPlaying ? 'bg-blue-700' : ''}
                  ${!session || isPlaying || isIntroPlaying ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                <Mic className="h-10 w-10 text-white" />
              </div>

              {isIntroPlaying && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <p className="text-sm text-blue-400">Eve is introducing herself...</p>
                  </div>
                  <p className="text-xs text-gray-400">Please wait for the introduction to finish</p>
                </div>
              )}

              {isRecording && <p className="text-sm text-red-400">Recording... Tap mic to stop.</p>}
              {isPlaying && !isIntroPlaying && <p className="text-sm text-blue-400">Eve is responding...</p>}
              {!isRecording && !isPlaying && !isIntroPlaying && (
                <p className="text-sm text-gray-400">
                  {turns.length === 0 && !isIntroPlaying
                    ? "Tap mic to start conversation."
                    : "Tap mic to share your thoughts."}
                </p>
              )}

              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={onEndSession}
                disabled={eveLoading || isRecording || isIntroPlaying}
              >
                End Session
              </Button>
            </div>
          ) : isJournalReplyMode ? (
            // Journal reply mode
            <div className="text-center space-y-6">
              <div
                className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-black shadow-lg shadow-blue-500/40 flex items-center justify-center transition-all duration-300 ${eveLoading ? 'animate-pulse' : ''
                  } ${isPlaying ? 'shadow-blue-400/60 animate-pulse' : ''}`}
              >
                <TbActivityHeartbeat className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-200">Journal Reply</p>
                <p className="text-xs text-gray-400">AI has responded to your journal entry.</p>
              </div>
              {isPlaying && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-blue-400">Playing response...</p>
                </div>
              )}
              <p className="text-xs text-gray-500">This is separate from voice sessions.</p>
            </div>
          ) : (
            // Default state
            <div className="text-center space-y-6">
              <div
                className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-black shadow-lg shadow-blue-500/40 flex items-center justify-center transition-all duration-300 ${eveLoading ? 'animate-pulse' : ''
                  } ${isPlaying ? 'shadow-blue-400/60 animate-pulse' : ''}`}
              >
                <TbActivityHeartbeat className="w-10 h-10 text-white" />
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-500 text-white hover:bg-gray-700"
                onClick={onStartSession}
                disabled={eveLoading}
              >
                {eveLoading ? 'Starting...' : 'Start Voice Session'}
              </Button>
              <p className="text-xs text-gray-400">
                Eve your mental wellness companion.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistantPanel;
