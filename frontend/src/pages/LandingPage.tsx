import React, { useEffect, useRef } from 'react';
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
    // Initial page animations
    const tl = createTimeline({ delay: 0.2 });
    
    if (welcomeRef.current) {
      tl.add(pageTransitions.fadeInUp(welcomeRef.current, 0));
    }

    // Animate cards with stagger
    const cards = cardsRef.current?.children;
    if (cards) {
      pageTransitions.staggerIn(cards, 0.5);
      
      // Add hover effects to cards
      Array.from(cards).forEach(card => {
        hoverAnimations.lift(card);
      });
    }

    // Animate stats section on scroll
    if (statsRef.current) {
      scrollAnimations.fadeInOnScroll(statsRef.current);
      
      // Animate counters when stats section is in view
      scrollAnimations.scaleInOnScroll(statsRef.current, {
        onComplete: () => {
          // Start counter animations
          if (counter1Ref.current) counterAnimation(counter1Ref.current, 7, 1);
          if (counter2Ref.current) counterAnimation(counter2Ref.current, 12, 1.2);
          if (counter3Ref.current) counterAnimation(counter3Ref.current, 5, 1.4);
          if (counter4Ref.current) counterAnimation(counter4Ref.current, 85, 1.6);
        }
      });
    }

    // Animate crisis section
    if (crisisRef.current) {
      scrollAnimations.fadeInOnScroll(crisisRef.current);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-ocean-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div ref={welcomeRef} className="text-center mb-16 opacity-0">
          <h1 className="text-4xl md:text-6xl font-bold text-ocean-text mb-6">
            Welcome back, {user?.name || user?.username || 'Friend'}!
          </h1>
          <p className="text-xl text-ocean-text opacity-70 max-w-2xl mx-auto">
            Your mental wellness journey continues here. Explore resources, connect with others, and take care of yourself.
          </p>
        </div>

        {/* Quick Actions */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link 
            to="/dashboard"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 bg-ocean-primary bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ocean-primary group-hover:bg-opacity-30 transition-all duration-300">
              <svg className="w-8 h-8 text-ocean-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-ocean-text mb-2">Dashboard</h3>
            <p className="text-ocean-text opacity-70">
              View your progress, track your wellness, and manage your profile
            </p>
          </Link>

          <Link 
            to="/blogs"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 bg-ocean-secondary bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ocean-secondary group-hover:bg-opacity-30 transition-all duration-300">
              <svg className="w-8 h-8 text-ocean-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-ocean-text mb-2">Mental Health Blogs</h3>
            <p className="text-ocean-text opacity-70">
              Read expert articles and tips for your mental wellness journey
            </p>
          </Link>

          <Link 
            to="/chat"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 bg-ocean-accent bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ocean-accent group-hover:bg-opacity-30 transition-all duration-300">
              <svg className="w-8 h-8 text-ocean-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-ocean-text mb-2">AI Support Chat</h3>
            <p className="text-ocean-text opacity-70">
              Get instant support and guidance from our AI wellness assistant
            </p>
          </Link>
        </div>

        {/* Wellness Stats */}
        <div ref={statsRef} className="bg-white rounded-xl shadow-lg p-8 mb-16 opacity-0">
          <h2 className="text-2xl font-bold text-ocean-text mb-6 text-center">
            Your Wellness Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div ref={counter1Ref} className="text-3xl font-bold text-ocean-primary mb-2">0</div>
              <div className="text-sm text-ocean-text opacity-70">Days Active</div>
            </div>
            <div className="text-center">
              <div ref={counter2Ref} className="text-3xl font-bold text-ocean-secondary mb-2">0</div>
              <div className="text-sm text-ocean-text opacity-70">Articles Read</div>
            </div>
            <div className="text-center">
              <div ref={counter3Ref} className="text-3xl font-bold text-ocean-accent mb-2">0</div>
              <div className="text-sm text-ocean-text opacity-70">Chat Sessions</div>
            </div>
            <div className="text-center">
              <div ref={counter4Ref} className="text-3xl font-bold text-ocean-primary mb-2">0</div>
              <div className="text-sm text-ocean-text opacity-70">Wellness Score</div>
            </div>
          </div>
        </div>

        {/* Crisis Support */}
        <div ref={crisisRef} className="p-6 bg-ocean-accent bg-opacity-10 rounded-lg border border-ocean-accent border-opacity-20 opacity-0">
          <p className="text-center text-ocean-text">
            <span className="font-semibold text-ocean-accent">Need immediate help?</span> Call 988 or text "HELLO" to 741741
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;