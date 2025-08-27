import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Calendar } from 'lucide-react';
import { listJournals } from '@/store/slices/journalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import toast from 'react-hot-toast';

const Journal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {entries, loading, error} = useAppSelector((state) => state.journal);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(listJournals({}));
    } else {
      toast.error('Please log in to view your journals');
      navigate('/login'); // Redirect to login if no token
    }
  }, [dispatch, navigate]);

  const handleCreateNew = () => {
    navigate('/journal/new');
  };

  const handleOpenJournal = (journalId: string) => {
    navigate(`/journal/edit/${journalId}`);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-ocean-text">Opening Journals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ocean-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-600">Error loading journals: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBE8D5] via-[#F5F3EA] to-[#DFD3B6] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ocean-text mb-2">My Journal</h1>
          <p className="text-gray-600">Your mind's safe reset button</p>
        </div>

        {/* Journals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Plus Button Card */}
          <Card
            onClick={handleCreateNew}
            className="flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardContent className="flex flex-col items-center justify-center py-3">
              <Button
                size="lg"
                className="w-18 h-18  !bg-[#F2EDE3] !text-black  transition-all duration-200 shadow-lg !p-0.5 hover:shadow-xl"
              >
                <Plus className="w-1/2 h-1/2" />
              </Button>
              <h3 className="mt-4 font-semibold text-gray-600">
                Create New Journal
              </h3>
              {/*<p className="text-sm text-gray-600 mt-1">Start writing your thoughts</p> */}
            </CardContent>
          </Card>
          {entries.map((journal) => (
            <Card
              key={journal.id || journal.title} // Fallback to title if id is missing
              onClick={() => journal.id && handleOpenJournal(journal.id)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 truncate">
                  <BookOpen className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{journal.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {journal.content}
                </p>
                {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {journal.created_at ? new Date(journal.created_at).toLocaleDateString() : 'N/A'}</span>
                  <Calendar className="h-3 w-3" />
                  <span>Updated: {journal.updated_at ? new Date(journal.updated_at).toLocaleDateString() : 'N/A'}</span>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>      
    </div>
  );
};

export default Journal;