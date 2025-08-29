import React from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { useSubscriptionStore, getCurrentPlanLimits, getUsagePercentage } from '../../stores/subscriptionStore';
import { useAuthStore } from '../../stores/authStore';
import { pricingPlans } from '../../data/pricing';
import { 
  StarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  BookOpenIcon,
  ArrowUpIcon 
} from '@heroicons/react/24/outline';

export const SubscriptionCard: React.FC = () => {
  const { user } = useAuthStore();
  const { currentPlan, usageStats } = useSubscriptionStore();
  
  const currentPlanData = pricingPlans.find(plan => plan.id === currentPlan);
  const planLimits = getCurrentPlanLimits(currentPlan);
  
  const handleUpgrade = () => {
    // Navigate to pricing section or upgrade modal
    window.location.href = '/#pricing';
  };

  const formatLimit = (limit: number, unit: string = '') => {
    if (limit === -1) return 'Unlimited';
    return `${limit}${unit}`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 75) return 'bg-yellow-100';
    return 'bg-blue-100';
  };

  if (!currentPlanData) return null;

  return (
    <Card className="relative overflow-hidden">
      {currentPlan !== 'free' && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-3 py-1 text-xs font-medium">
          <StarIcon className="w-3 h-3 inline mr-1" />
          Premium
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {currentPlanData.name} Plan
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {currentPlanData.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {currentPlanData.monthlyPrice === 0 ? 'Free' : `$${currentPlanData.monthlyPrice}`}
            </div>
            {currentPlanData.monthlyPrice > 0 && (
              <div className="text-sm text-gray-500">/month</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 text-sm">Usage This Month</h4>
          
          {/* Minutes Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">AI Tutoring Minutes</span>
              </div>
              <span className="font-medium text-gray-900">
                {usageStats.minutesUsed} / {formatLimit(planLimits.monthlyMinutes)}
              </span>
            </div>
            {planLimits.monthlyMinutes !== -1 && (
              <div className={`w-full ${getProgressBgColor(getUsagePercentage(usageStats.minutesUsed, planLimits.monthlyMinutes))} rounded-full h-2`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getUsagePercentage(usageStats.minutesUsed, planLimits.monthlyMinutes))}`}
                  style={{ width: `${getUsagePercentage(usageStats.minutesUsed, planLimits.monthlyMinutes)}%` }}
                />
              </div>
            )}
          </div>

          {/* Companions Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">AI Companions</span>
              </div>
              <span className="font-medium text-gray-900">
                {usageStats.companionsCreated} / {formatLimit(planLimits.maxCompanions)}
              </span>
            </div>
            {planLimits.maxCompanions !== -1 && (
              <div className={`w-full ${getProgressBgColor(getUsagePercentage(usageStats.companionsCreated, planLimits.maxCompanions))} rounded-full h-2`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getUsagePercentage(usageStats.companionsCreated, planLimits.maxCompanions))}`}
                  style={{ width: `${getUsagePercentage(usageStats.companionsCreated, planLimits.maxCompanions)}%` }}
                />
              </div>
            )}
          </div>

          {/* Courses Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Courses</span>
              </div>
              <span className="font-medium text-gray-900">
                {usageStats.coursesCreated} / {formatLimit(planLimits.maxCourses)}
              </span>
            </div>
            {planLimits.maxCourses !== -1 && (
              <div className={`w-full ${getProgressBgColor(getUsagePercentage(usageStats.coursesCreated, planLimits.maxCourses))} rounded-full h-2`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getUsagePercentage(usageStats.coursesCreated, planLimits.maxCourses))}`}
                  style={{ width: `${getUsagePercentage(usageStats.coursesCreated, planLimits.maxCourses)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Section */}
        {currentPlan !== 'ultimate' && currentPlan !== 'enterprise' && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Need more resources?</p>
                <p className="text-xs text-gray-600">Upgrade to unlock higher limits</p>
              </div>
              <Button
                onClick={handleUpgrade}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </div>
          </div>
        )}

        {/* Usage Warnings */}
        {(getUsagePercentage(usageStats.minutesUsed, planLimits.monthlyMinutes) >= 80 ||
          getUsagePercentage(usageStats.companionsCreated, planLimits.maxCompanions) >= 80 ||
          getUsagePercentage(usageStats.coursesCreated, planLimits.maxCourses) >= 80) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Approaching Limits</p>
                <p className="text-xs text-yellow-700 mt-1">
                  You're close to reaching your plan limits. Consider upgrading to avoid interruptions.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
