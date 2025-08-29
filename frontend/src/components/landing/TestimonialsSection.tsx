import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Medical Student',
    company: 'Stanford University',
    content: 'TutorSpeakAI transformed how I study anatomy. The voice interactions make complex topics feel like conversations with a knowledgeable friend. My retention improved by 40%!',
    avatar: '👩‍⚕️',
    rating: 5
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    company: 'Google',
    content: 'As someone learning machine learning, the AI companions adapt to my pace perfectly. I can interrupt with questions anytime, just like in real conversations.',
    avatar: '👨‍💻',
    rating: 5
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'High School Teacher',
    company: 'Lincoln High School',
    content: 'I use TutorSpeakAI to create interactive lessons from textbooks. My students are more engaged than ever, and I save hours on lesson planning.',
    avatar: '👩‍🏫',
    rating: 5
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'MBA Student',
    company: 'Wharton School',
    content: 'The course creation feature is incredible. I uploaded case studies and got structured learning paths instantly. It\'s like having a personal tutor 24/7.',
    avatar: '👨‍🎓',
    rating: 5
  },
  {
    id: '5',
    name: 'Priya Patel',
    role: 'Language Learner',
    company: 'Self-employed',
    content: 'Learning Spanish with voice-first AI feels natural. The pronunciation feedback and conversational practice helped me become fluent in months, not years.',
    avatar: '👩‍🎨',
    rating: 5
  },
  {
    id: '6',
    name: 'James Wilson',
    role: 'Corporate Trainer',
    company: 'Microsoft',
    content: 'We use TutorSpeakAI for employee training. The analytics show 60% better completion rates compared to traditional e-learning platforms.',
    avatar: '👨‍💼',
    rating: 5
  }
];

export const TestimonialsSection: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {' '}Learners Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of students, professionals, and educators who have transformed 
            their learning experience with TutorSpeakAI.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-sm text-gray-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-sm text-gray-600">Learning Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-sm text-gray-600">Courses Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className={`hover:shadow-lg transition-all duration-300 border-0 shadow-md ${
                index % 3 === 1 ? 'md:translate-y-4' : ''
              }`}
            >
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                      {testimonial.company && (
                        <>
                          <span className="mx-1">•</span>
                          {testimonial.company}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social proof logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-8">Trusted by students and professionals from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Stanford</div>
            <div className="text-2xl font-bold text-gray-400">MIT</div>
            <div className="text-2xl font-bold text-gray-400">Harvard</div>
            <div className="text-2xl font-bold text-gray-400">Google</div>
            <div className="text-2xl font-bold text-gray-400">Microsoft</div>
            <div className="text-2xl font-bold text-gray-400">Apple</div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of learners who have already discovered the power of AI-driven education. 
              Start your journey today with our free plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Learning Free
              </button>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
