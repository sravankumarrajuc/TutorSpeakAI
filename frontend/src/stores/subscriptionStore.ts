import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubscriptionStatus, PlanType } from '../../../shared/src/types/pricing';

interface SubscriptionState {
  subscription: SubscriptionStatus | null;
  currentPlan: PlanType;
  usageStats: {
    minutesUsed: number;
    companionsCreated: number;
    coursesCreated: number;
  };
  isLoading: boolean;
  
  // Actions
  setSubscription: (subscription: SubscriptionStatus) => void;
  setCurrentPlan: (plan: PlanType) => void;
  updateUsageStats: (stats: Partial<SubscriptionState['usageStats']>) => void;
  setLoading: (loading: boolean) => void;
  clearSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: null,
      currentPlan: 'free',
      usageStats: {
        minutesUsed: 0,
        companionsCreated: 0,
        coursesCreated: 0,
      },
      isLoading: false,

      setSubscription: (subscription) =>
        set({ subscription }),

      setCurrentPlan: (plan) =>
        set({ currentPlan: plan }),

      updateUsageStats: (stats) =>
        set((state) => ({
          usageStats: { ...state.usageStats, ...stats },
        })),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      clearSubscription: () =>
        set({
          subscription: null,
          currentPlan: 'free',
          usageStats: {
            minutesUsed: 0,
            companionsCreated: 0,
            coursesCreated: 0,
          },
        }),
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        subscription: state.subscription,
        currentPlan: state.currentPlan,
        usageStats: state.usageStats,
      }),
    }
  )
);

// Helper functions
export const getCurrentPlanLimits = (planType: PlanType) => {
  const planLimits = {
    free: { monthlyMinutes: 30, maxCompanions: 1, maxCourses: 3 },
    starter: { monthlyMinutes: 120, maxCompanions: 3, maxCourses: 10 },
    professional: { monthlyMinutes: 500, maxCompanions: 10, maxCourses: 50 },
    ultimate: { monthlyMinutes: 1500, maxCompanions: -1, maxCourses: -1 },
    enterprise: { monthlyMinutes: -1, maxCompanions: -1, maxCourses: -1 },
  };
  
  return planLimits[planType];
};

export const getUsagePercentage = (used: number, limit: number) => {
  if (limit === -1) return 0; // Unlimited
  return Math.min((used / limit) * 100, 100);
};
