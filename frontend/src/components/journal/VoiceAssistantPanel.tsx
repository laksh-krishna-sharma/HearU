import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Bot } from 'lucide-react';

interface VoiceAssistantPanelProps {
  session: any;
  isRecording: boolean;
  isPlaying: boolean;
  eveLoading: boolean;
  isJournalReplyMode: boolean;
  isIntroPlaying: boolean;
  turns: any[];
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
  // console.log("VoiceAssistantPanel render - session:", session);
  return (
    <div className="lg:col-span-1 flex flex-col hover:shadow-lg">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-4 w-4" /> Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          
          {/* Only show voice session controls when we have an active session AND we're not in journal reply mode */}
          {session && !isJournalReplyMode ? (
            <div className="text-center space-y-4">
              <div 
                onClick={isRecording ? onStopRecording : onStartRecording}
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors
                  ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200 hover:bg-gray-300'}
                  ${isPlaying ? 'bg-blue-300' : ''}
                  ${!session || isPlaying || isIntroPlaying ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                <Mic className="h-10 w-10 text-black" />
              </div>
              
              {isIntroPlaying && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-blue-600">Eve is introducing herself...</p>
                  </div>
                  <p className="text-xs text-gray-500">Please wait for the introduction to finish</p>
                </div>
              )}
              
              {isRecording && <p className="text-sm text-gray-600">Recording... Tap mic to stop.</p>}
              {isPlaying && !isIntroPlaying && <p className="text-sm text-gray-600">Eve is responding...</p>}
              {!isRecording && !isPlaying && !isIntroPlaying && (
                <p className="text-sm text-gray-600">
                  {turns.length === 0 && !isIntroPlaying ? "Tap mic to start conversation." : "Tap mic to share your thoughts."}
                </p>
              )}
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={onEndSession}
                disabled={eveLoading || isRecording || isIntroPlaying}
              >
                End Session
              </Button>
            </div>
          ) : isJournalReplyMode ? (
            // Show minimal UI when in journal reply mode - NO VOICE ASSISTANT FUNCTIONALITY
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-10 w-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">Journal Reply</p>
                <p className="text-xs text-gray-500">AI has responded to your journal entry.</p>
              </div>
              {isPlaying && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-blue-600">Playing response...</p>
                </div>
              )}
              <p className="text-xs text-gray-400">This is separate from voice sessions.</p>
            </div>
          ) : (
            // Default state - no session active
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="h-10 w-10 text-black" />
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onStartSession}
                disabled={eveLoading}
              >
                {eveLoading ? 'Starting...' : 'Start Voice Session'}
              </Button>
              <p className="text-xs text-gray-500">Start a voice conversation with Eve, your mental wellness companion.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistantPanel;