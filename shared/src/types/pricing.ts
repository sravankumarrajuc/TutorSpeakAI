export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  description: string;
  features: string[];
  limitations: {
    monthlyMinutes: number;
    maxCompanions: number;
    maxCourses: number;
    supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
  };
  popular?: boolean;
  stripePriceIds?: {
    monthly: string;
    annual: string;
  };
}

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  included: boolean;
}

export interface SubscriptionStatus {
  planId: string;
  interval: 'monthly' | 'annual';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  usageThisMonth: {
    minutes: number;
    companions: number;
    courses: number;
  };
}

export interface BillingInterval {
  type: 'monthly' | 'annual';
  label: string;
  discount?: number;
}

export type PlanType = 'free' | 'starter' | 'professional' | 'ultimate' | 'enterprise';
