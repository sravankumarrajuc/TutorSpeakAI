import { PricingPlan, BillingInterval } from '../../../shared/src/types/pricing';

export const billingIntervals: BillingInterval[] = [
  {
    type: 'monthly',
    label: 'Monthly'
  },
  {
    type: 'annual',
    label: 'Annual',
    discount: 20
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'USD',
    description: 'Perfect for getting started with AI tutoring',
    features: [
      '30 minutes of AI tutoring per month',
      '1 AI companion',
      '3 courses maximum',
      'Basic voice interaction',
      'Community support',
      'Standard assessments'
    ],
    limitations: {
      monthlyMinutes: 30,
      maxCompanions: 1,
      maxCourses: 3,
      supportLevel: 'community'
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 9.99,
    annualPrice: 7.99, // 20% discount: 9.99 * 0.8 = 7.99
    currency: 'USD',
    description: 'Great for individual learners and students',
    features: [
      '120 minutes of AI tutoring per month',
      '3 AI companions',
      '10 courses maximum',
      'Enhanced voice interaction',
      'Email support',
      'Advanced assessments',
      'Progress analytics'
    ],
    limitations: {
      monthlyMinutes: 120,
      maxCompanions: 3,
      maxCourses: 10,
      supportLevel: 'email'
    },
    stripePriceIds: {
      monthly: 'price_starter_monthly',
      annual: 'price_starter_annual'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 29.99,
    annualPrice: 23.99, // 20% discount: 29.99 * 0.8 = 23.99
    currency: 'USD',
    description: 'Ideal for professionals and serious learners',
    features: [
      '500 minutes of AI tutoring per month',
      '10 AI companions',
      '50 courses maximum',
      'Premium voice interaction',
      'Priority email support',
      'Custom assessments',
      'Detailed analytics',
      'Course creation tools',
      'Export capabilities'
    ],
    limitations: {
      monthlyMinutes: 500,
      maxCompanions: 10,
      maxCourses: 50,
      supportLevel: 'priority'
    },
    popular: true,
    stripePriceIds: {
      monthly: 'price_professional_monthly',
      annual: 'price_professional_annual'
    }
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    monthlyPrice: 79.99,
    annualPrice: 63.99, // 20% discount: 79.99 * 0.8 = 63.99
    currency: 'USD',
    description: 'For power users and small teams',
    features: [
      '1500 minutes of AI tutoring per month',
      'Unlimited AI companions',
      'Unlimited courses',
      'Premium voice interaction with barge-in',
      'Dedicated support',
      'Custom assessments & analytics',
      'Advanced course creation',
      'API access',
      'White-label options',
      'Team collaboration'
    ],
    limitations: {
      monthlyMinutes: 1500,
      maxCompanions: -1, // -1 means unlimited
      maxCourses: -1,
      supportLevel: 'dedicated'
    },
    stripePriceIds: {
      monthly: 'price_ultimate_monthly',
      annual: 'price_ultimate_annual'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 0, // Custom pricing
    annualPrice: 0, // Custom pricing
    currency: 'USD',
    description: 'Custom solutions for organizations',
    features: [
      'Unlimited AI tutoring minutes',
      'Unlimited AI companions',
      'Unlimited courses',
      'Enterprise voice infrastructure',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced analytics & reporting',
      'SSO integration',
      'Custom branding',
      'SLA guarantees',
      'On-premise deployment options'
    ],
    limitations: {
      monthlyMinutes: -1,
      maxCompanions: -1,
      maxCourses: -1,
      supportLevel: 'dedicated'
    }
  }
];

export const features = [
  {
    id: 'voice-interaction',
    name: 'Voice-First AI Tutoring',
    description: 'Natural conversations with AI tutors using advanced speech recognition and synthesis',
    icon: '🎙️'
  },
  {
    id: 'course-creation',
    name: 'AI-Powered Course Creation',
    description: 'Upload documents and let AI generate structured, interactive courses automatically',
    icon: '📚'
  },
  {
    id: 'ai-companions',
    name: 'Personalized AI Companions',
    description: 'Create custom AI tutors with unique personalities and teaching styles',
    icon: '🤖'
  },
  {
    id: 'assessments',
    name: 'Smart Assessments',
    description: 'Auto-generated tests and quizzes with voice-guided feedback',
    icon: '📝'
  },
  {
    id: 'analytics',
    name: 'Learning Analytics',
    description: 'Track progress, identify strengths, and get personalized recommendations',
    icon: '📊'
  },
  {
    id: 'real-time',
    name: 'Real-Time Interaction',
    description: 'Low-latency voice conversations with barge-in capabilities',
    icon: '⚡'
  }
];
