import { PlanDetails } from '@/types';

export const plans: PlanDetails[] = [
  {
    name: 'single',
    price: 0,
    tokenLimit: 1000,
    features: [
      'Basic CSV Analysis',
      'Single Organization',
      'Personal Usage',
      '1,000 Tokens/month',
    ],
    maxOrganizations: 1,
    maxMembers: 1,
  },
  {
    name: 'team',
    price: 29,
    tokenLimit: 10000,
    features: [
      'Advanced CSV Analysis',
      'Up to 3 Organizations',
      'Team Collaboration',
      '10,000 Tokens/month',
      'Priority Support',
    ],
    maxOrganizations: 3,
    maxMembers: 10,
  },
  {
    name: 'pro',
    price: 99,
    tokenLimit: 50000,
    features: [
      'Enterprise CSV Analysis',
      'Unlimited Organizations',
      'Advanced Team Management',
      '50,000 Tokens/month',
      '24/7 Priority Support',
      'Custom Integrations',
    ],
    maxOrganizations: Infinity,
    maxMembers: Infinity,
  },
];