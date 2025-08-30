import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Bot } from 'lucide-react';

interface VoiceAssistantPanelProps {
  session: any;
  isRecording: boolean;
  isPlaying: boolean;
  eveLoading: boolean;
  eveError: any;
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
  eveError,
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
          
          {session ? (
            <div className="text-center space-y-4">
              <div 
                onClick={isRecording ? onStopRecording : onStartRecording}
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors
                  ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200 hover:bg-gray-300'}
                  ${isPlaying ? 'bg-blue-300' : ''}
                  ${!session || isPlaying ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                <Mic className="h-10 w-10 text-black" />
              </div>
              {isRecording && <p className="text-sm text-gray-600">Recording... Tap mic to stop.</p>}
              {isPlaying && <p className="text-sm text-gray-600">Eve is speaking...</p>}
              {!isRecording && !isPlaying && <p className="text-sm text-gray-600">Tap mic to share your thoughts.</p>}
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={onEndSession}
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
                onClick={onStartSession}
                disabled={eveLoading}
              >
                {eveLoading ? 'Starting...' : 'Start Voice Session'}
              </Button>
              <p className="text-xs text-gray-500">Start a voice conversation with Eve, your mental wellness companion.</p>
            </div>
          )}
          {eveError && <p className="text-xs text-red-500 mt-2">Error: {typeof eveError === 'string' ? eveError : 'An assistant error occurred.'}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistantPanel;