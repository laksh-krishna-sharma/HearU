import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/hooks/hooks';
import { pageTransitions, scrollAnimations, counterAnimation, hoverAnimations, createTimeline } from '../utils/animations';

const LandingPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const crisisRef = useRef<HTMLDivElement>(null);
  const counter1Ref = useRef<HTMLDivElement>(null);
  const counter2Ref = useRef<HTMLDivElement>(null);
  const counter3Ref = useRef<HTMLDivElement>(null);
  const counter4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = createTimeline({ delay: 0.2 });
    
    if (welcomeRef.current) {
      tl.add(pageTransitions.fadeInUp(welcomeRef.current, 0));
    }

    const cards = cardsRef.current?.children;
    if (cards) {
      pageTransitions.staggerIn(Array.from(cards), 0.5);
      Array.from(cards).forEach(card => hoverAnimations.lift(card));
    }

    if (statsRef.current) {
      scrollAnimations.fadeInOnScroll(statsRef.current);
      scrollAnimations.scaleInOnScroll(statsRef.current, {
        onComplete: () => {
          if (counter1Ref.current) counterAnimation(counter1Ref.current, 7, 1);
          if (counter2Ref.current) counterAnimation(counter2Ref.current, 12, 1.2);
          if (counter3Ref.current) counterAnimation(counter3Ref.current, 5, 1.4);
          if (counter4Ref.current) counterAnimation(counter4Ref.current, 85, 1.6);
        }
      });
    }

    if (crisisRef.current) scrollAnimations.fadeInOnScroll(crisisRef.current);

    return () => {
      tl.kill();
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Welcome Section */}
        <div ref={welcomeRef} className="text-center mb-20 opacity-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight">
            Welcome back,{' '}
            <span>{user?.name || user?.username || 'Friend'}</span>!
          </h1>
          <p className="text-xl md:text-2xl text-ocean-text/70 max-w-3xl mx-auto leading-relaxed">
            Your mental wellness journey continues here. Explore resources, connect with others, and take care of yourself with compassion.
          </p>
        </div>

        {/* Quick Actions */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Link 
            to="/journal"
            className="group bg-gradient-to-br from-blue-400 to-black rounded-2xl shadow-lg shadow-blue-500/40 p-8 transition-all duration-300 transform hover:scale-105 hover:-rotate-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 shadow-md shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">My Journal</h3>
            <p className="text-white/70 leading-relaxed">
              Continue your personal wellness journey with guided journaling and reflection
            </p>
          </Link>

          <Link 
            to="/blogs"
            className="group bg-gradient-to-br from-blue-400 to-black rounded-2xl shadow-lg shadow-blue-500/40 p-8 transition-all duration-300 transform hover:scale-105 hover:rotate-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 shadow-md shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Mental Health Blogs</h3>
            <p className="text-white/70 leading-relaxed">
              Read expert articles and evidence-based tips for your mental wellness journey
            </p>
          </Link>

          <Link 
            to="/chat"
            className="group bg-gradient-to-br from-blue-400 to-black rounded-2xl shadow-lg shadow-blue-500/40 p-8 transition-all duration-300 transform hover:scale-105 hover:-rotate-1 md:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 shadow-md shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">AI Support Chat</h3>
            <p className="text-white/70 leading-relaxed">
              Get instant, compassionate support and guidance from our AI wellness assistant
            </p>
          </Link>
        </div>

        {/* Inspirational Quote Section */}
        <div className="text-center bg-gradient-to-br from-blue-400 to-black rounded-3xl p-8 md:p-12 shadow-lg shadow-blue-500/40 animate-fade-in">
          <blockquote className="text-xl md:text-2xl font-medium text-white/80 italic mb-4 leading-relaxed">
            "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives."
          </blockquote>
          <cite className="text-white/60 font-semibold">— William James</cite>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
