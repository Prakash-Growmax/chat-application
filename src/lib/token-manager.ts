import { User } from '@/types';

export const TOKEN_COSTS = {
  TEXT_WORD: 1,
  COMPLEX_QUERY: 10,
  IMAGE_GENERATION: 50,
} as const;

export const PLAN_LIMITS = {
  single: 1000,
  team: 5000,
  pro: Infinity,
} as const;

export function calculateTokenCost(text: string, isComplexQuery: boolean = false): number {
  const wordCount = text.trim().split(/\s+/).length;
  const baseCost = wordCount * TOKEN_COSTS.TEXT_WORD;
  return isComplexQuery ? baseCost + TOKEN_COSTS.COMPLEX_QUERY : baseCost;
}

export function hasEnoughTokens(user: User, cost: number): boolean {
  const planLimit = PLAN_LIMITS[user.plan];
  return user.tokenUsage + cost <= planLimit;
}

export function getRemainingTokens(user: User): number {
  const planLimit = PLAN_LIMITS[user.plan];
  return planLimit - user.tokenUsage;
}

export function getTokenUsagePercentage(user: User): number {
  const planLimit = PLAN_LIMITS[user.plan];
  return (user.tokenUsage / planLimit) * 100;
}

export function shouldShowTokenWarning(user: User): boolean {
  const remainingPercentage = 100 - getTokenUsagePercentage(user);
  return remainingPercentage <= 20;
}