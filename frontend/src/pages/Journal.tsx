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
    <div className="min-h-screen bg-gradient-to-br from-wellness-cream via-wellness-warm-white to-wellness-peach/20 p-6 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wellness-mint/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-wellness-lavender/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-wellness-sky/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-ocean-text mb-4">
            My{' '}
            <span className="">
              Journal
            </span>
          </h1>
          <p className="text-lg text-ocean-text/70 max-w-2xl mx-auto leading-relaxed">
            Your mind's safe reset button - a sanctuary for your thoughts and reflections
          </p>
        </div>

        {/* Journals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
          {/* Plus Button Card */}
          <Card
            onClick={handleCreateNew}
            className="group flex items-center justify-center cursor-pointer bg-gradient-to-br from-white/80 to-wellness-cream/60 backdrop-blur-sm border-2 border-dashed border-ocean-primary/30 hover:border-ocean-primary/60 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 hover:rotate-1 min-h-[200px]"
          >
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-full blur-lg animate-pulse-soft"></div>
                <Button
                  size="lg"
                  className="relative w-16 h-16 bg-gradient-to-r from-ocean-primary to-ocean-secondary text-white shadow-medium hover:shadow-glow transition-all duration-300 transform group-hover:scale-110 rounded-full border-none"
                >
                  <Plus className="w-8 h-8" />
                </Button>
              </div>
              <h3 className="font-semibold text-ocean-text group-hover:text-ocean-primary transition-colors duration-300">
                Create New Journal
              </h3>
              <p className="text-sm text-ocean-text/60 mt-2 group-hover:text-ocean-text/80 transition-colors duration-300">
                Start your wellness journey
              </p>
            </CardContent>
          </Card>

          {entries.map((journal, index) => (
            <Card
              key={journal.id || journal.title}
              onClick={() => journal.id && handleOpenJournal(journal.id)}
              className="group cursor-pointer bg-gradient-to-br from-white/90 to-wellness-warm-white/80 backdrop-blur-sm border border-white/40 shadow-soft hover:shadow-large transition-all duration-300 transform hover:scale-105 hover:-rotate-1 min-h-[200px] animate-scale-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 truncate text-ocean-text group-hover:text-ocean-primary transition-colors duration-300">
                  <div className="p-2 bg-gradient-to-r from-ocean-primary/10 to-ocean-secondary/10 rounded-lg group-hover:from-ocean-primary/20 group-hover:to-ocean-secondary/20 transition-all duration-300">
                    <BookOpen className="h-5 w-5 text-ocean-primary group-hover:text-ocean-secondary transition-colors duration-300" />
                  </div>
                  <span className="truncate font-semibold">{journal.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-ocean-text/70 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {journal.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-ocean-text/50 bg-wellness-cream/50 rounded-lg px-3 py-2">
                  <Calendar className="h-3 w-3 text-ocean-primary" />
                  <span className="font-medium">
                    {journal.created_at ? new Date(journal.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-r from-ocean-primary/10 to-ocean-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-ocean-primary/60" />
            </div>
            <h3 className="text-xl font-semibold text-ocean-text mb-2">Start Your Journey</h3>
            <p className="text-ocean-text/60 max-w-md mx-auto">
              Create your first journal entry and begin your path to mental wellness and self-reflection.
            </p>
          </div>
        )}
      </div>      
    </div>
  );
};

export default Journal;