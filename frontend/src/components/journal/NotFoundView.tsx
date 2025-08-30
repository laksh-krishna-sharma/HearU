import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  onBack: () => void;
}

const NotFoundView: React.FC<NotFoundViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-ocean-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
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
};

export default NotFoundView;