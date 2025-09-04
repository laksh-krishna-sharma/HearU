import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';

const SummaryDetailView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { summary } = location.state || {};

  if (!summary) {
    return (
      <div className="min-h-screen bg-ocean-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => navigate('/journal')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Journal
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p>Summary not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });

  return (
    <div className="min-h-screen bg-ocean-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {formatDate(summary.session_date)}
              </span>
            </div>
            <CardTitle>Voice Session Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.summary && (
              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{summary.summary}</p>
              </div>
            )}
            
            {summary.notes_content && (
              <div>
                <h3 className="text-lg font-medium mb-2">Key Notes</h3>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {summary.notes_content}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryDetailView;