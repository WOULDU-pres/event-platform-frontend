import { useCallback } from 'react';
import { useQuizTimeStore } from '../stores';
import { Reward, UseRewardsReturn } from '../types';

/**
 * Hook for managing quiz rewards
 */
export const useRewards = (): UseRewardsReturn => {
  const store = useQuizTimeStore();
  
  // Filter rewards by type
  const filterByType = useCallback((type: string): Reward[] => {
    return store.rewards.filter(reward => reward.type === type);
  }, [store.rewards]);
  
  // Filter rewards by redemption status
  const filterByRedemptionStatus = useCallback((isRedeemed: boolean): Reward[] => {
    return store.rewards.filter(reward => reward.isRedeemed === isRedeemed);
  }, [store.rewards]);
  
  // Calculate total value of all rewards
  const calculateTotalRewardValue = useCallback((): number => {
    return store.rewards.reduce((total, reward) => total + reward.value, 0);
  }, [store.rewards]);
  
  // Calculate total value of redeemed rewards
  const calculateRedeemedRewardValue = useCallback((): number => {
    return store.rewards
      .filter(reward => reward.isRedeemed)
      .reduce((total, reward) => total + reward.value, 0);
  }, [store.rewards]);
  
  // Refresh rewards list
  const refreshRewards = useCallback(async () => {
    await store.fetchRewards();
  }, [store]);
  
  // Call reward redemption function
  const redeemReward = useCallback(async (rewardId: string) => {
    await store.redeemReward(rewardId);
  }, [store]);
  
  return {
    rewards: store.rewards,
    isLoading: store.isRewardsLoading,
    error: store.error,
    filterByType,
    filterByRedemptionStatus,
    calculateTotalRewardValue,
    calculateRedeemedRewardValue,
    refreshRewards,
    redeemReward
  };
}; 