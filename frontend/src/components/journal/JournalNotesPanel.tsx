import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Bot, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceSummary {
  id: string;
  summary: string;
  notes_content: string;
  session_date: string;
  session_id: string;
}

interface NotesPanelProps {
  voiceSummaries: VoiceSummary[];
}

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });

const NotesPanel: React.FC<NotesPanelProps> = ({ voiceSummaries }) => {
  const navigate = useNavigate();

  const handleSummaryClick = (summary: VoiceSummary) => {
    navigate(`/journal/summary/${summary.id}`, { state: { summary } });
  };

  return (
    <div className="lg:col-span-1 hover:shadow-lg">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Voice Summaries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {voiceSummaries.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No voice summaries yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  End a voice session with "Save Summary" to see notes here
                </p>
              </div>
            ) : (
              voiceSummaries.map((summary) => (
                <div 
                  key={summary.id} 
                  className="p-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleSummaryClick(summary)}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(summary.session_date)}
                    </span>
                  </div>
                  
                  <p className="text-xs font-medium text-gray-800 line-clamp-1">
                    {summary.summary ? summary.summary.substring(0, 50) + '...' : 'Voice Session Summary'}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesPanel;