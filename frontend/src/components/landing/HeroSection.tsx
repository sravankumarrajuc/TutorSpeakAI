import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const HeroSection: React.FC = () => {
  const handleGetStarted = () => {
    // Scroll to pricing section
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchDemo = () => {
    // TODO: Implement demo modal or video
    console.log('Watch demo clicked');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Now with Real-Time Voice Interaction
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            The Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {' '}AI Tutoring{' '}
            </span>
            is Here
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform any document into an interactive course with personalized AI companions. 
            Experience natural voice conversations that adapt to your learning style.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Free
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleWatchDemo}
              className="text-lg px-8 py-4 border-2 hover:bg-gray-50"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="text-sm text-gray-500 mb-12">
            <p>Trusted by 10,000+ learners worldwide • No credit card required</p>
          </div>
        </div>

        {/* Feature preview cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl mb-4">🎙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice-First Learning</h3>
            <p className="text-gray-600 text-sm">Natural conversations with AI tutors using advanced speech recognition</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Course Creation</h3>
            <p className="text-gray-600 text-sm">Upload any document and get a structured, interactive course instantly</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal AI Tutors</h3>
            <p className="text-gray-600 text-sm">Customize AI companions with unique personalities and teaching styles</p>
          </Card>
        </div>
      </div>
    </section>
  );
};
