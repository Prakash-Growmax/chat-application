export interface Plan {
  id: string;
  name: string;
  monthlyTokenLimit: number;
  price: number;
  stripePriceId: string;
  features: string[];
  canInviteTeam: boolean;
}

export interface PlanWithMetadata extends Plan {
  isPopular?: boolean;
  isEnterprise?: boolean;
}
