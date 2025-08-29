import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { pricingPlans, billingIntervals } from '../../data/pricing';

export const PricingSection: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (planId: string, interval: 'monthly' | 'annual') => {
    if (planId === 'free') {
      // Redirect to registration with free plan
      window.location.href = '/register?plan=free';
    } else if (planId === 'enterprise') {
      // Contact sales
      console.log('Contact sales for enterprise plan');
    } else {
      // Redirect to registration with selected plan and interval
      window.location.href = `/register?plan=${planId}&interval=${interval}`;
    }
  };

  const formatPrice = (plan: typeof pricingPlans[0]) => {
    const price = billingInterval === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    if (price === 0) {
      // Show "Custom" for Enterprise plan, "Free" for actual free plan
      return plan.id === 'enterprise' ? 'Custom' : 'Free';
    }
    return `$${price.toFixed(2)}`;
  };

  const formatFeatureLimit = (limit: number, unit: string) => {
    if (limit === -1) return 'Unlimited';
    return `${limit} ${unit}`;
  };

  const getDiscountBadge = () => {
    const annualInterval = billingIntervals.find(interval => interval.type === 'annual');
    return annualInterval?.discount ? `Save ${annualInterval.discount}%` : '';
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {' '}Learning Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core AI tutoring features 
            with different usage limits and support levels.
          </p>
          
          {/* Billing toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {billingIntervals.map((interval) => (
              <button
                key={interval.type}
                onClick={() => setBillingInterval(interval.type)}
                className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 relative ${
                  billingInterval === interval.type
                    ? 'text-white bg-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {interval.label}
                {interval.discount && billingInterval === interval.type && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    -{interval.discount}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative hover:shadow-xl transition-all duration-300 flex flex-col h-full ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-lg transform scale-105' 
                  : 'border border-gray-200 hover:-translate-y-1'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4 flex-shrink-0">
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(plan)}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-gray-500 ml-1">
                        /{billingInterval === 'monthly' ? 'month' : 'month'}
                      </span>
                    )}
                  </div>
                  {billingInterval === 'annual' && plan.monthlyPrice > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      {getDiscountBadge()} vs monthly
                    </div>
                  )}
                </div>
                <CardDescription className="text-sm text-gray-600 min-h-[3rem] flex items-center justify-center">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex-grow flex flex-col">
                {/* Key metrics */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Minutes</span>
                    <span className="font-semibold text-gray-900">
                      {formatFeatureLimit(plan.limitations.monthlyMinutes, 'min')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">AI Companions</span>
                    <span className="font-semibold text-gray-900">
                      {formatFeatureLimit(plan.limitations.maxCompanions, '')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Courses</span>
                    <span className="font-semibold text-gray-900">
                      {formatFeatureLimit(plan.limitations.maxCourses, '')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Support</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {plan.limitations.supportLevel}
                    </span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2 flex-grow">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-sm text-gray-500 italic">
                      +{plan.features.length - 4} more features
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="pt-4 mt-auto">
                  <Button
                    onClick={() => handleSelectPlan(plan.id, billingInterval)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        : plan.id === 'enterprise'
                        ? 'bg-gray-900 hover:bg-gray-800'
                        : ''
                    }`}
                    variant={plan.popular || plan.id === 'enterprise' ? 'default' : 'outline'}
                  >
                    {plan.id === 'free' 
                      ? 'Start Free' 
                      : plan.id === 'enterprise' 
                      ? 'Contact Sales' 
                      : 'Get Started'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limits?</h4>
                <p className="text-gray-600 text-sm">You'll receive notifications as you approach limits. Upgrade anytime to continue using the service.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600 text-sm">Our Free plan gives you 30 minutes monthly to try all core features. No credit card required.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
                <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
