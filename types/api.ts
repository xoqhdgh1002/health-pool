// API 요청/응답 타입 정의

// ============================================
// Funding Deal API Types
// ============================================

export interface CreateFundingDealRequest {
  menuItemId: string;
  seasonName?: string;
  targetCount: number;
  discountedPrice: number;
  deadline: string | Date; // ISO 8601 형식 또는 Date 객체
  description?: string;
  userId: string; // 임시: 실제로는 세션에서 가져옴
}

export interface CreateFundingDealResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    seasonName: string;
    targetCount: number;
    currentCount: number;
    discountedPrice: number;
    deadline: string;
    status: string;
    description: string | null;
    menuItemId: string;
    menuItem: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      restaurant: {
        id: string;
        name: string;
        address: string;
      };
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface FundingDealMetadata {
  participationRate: number; // 참여율 (0-100)
  remainingCount: number; // 남은 인원
  discountRate: number; // 할인율 (%)
  daysRemaining: number; // 남은 일수
  isAlmostFull: boolean; // 거의 마감 (80% 이상)
  isExpiringSoon: boolean; // 곧 만료 (3일 이하)
}

export interface GetFundingDealsResponse {
  success: boolean;
  data: Array<{
    id: string;
    seasonName: string;
    targetCount: number;
    currentCount: number;
    discountedPrice: number;
    deadline: string;
    status: string;
    description: string | null;
    menuItem: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      isAvailable: boolean;
      restaurant: {
        id: string;
        name: string;
        address: string;
        phoneNumber: string | null;
        imageUrl: string | null;
        description: string | null;
      };
    };
    _count: {
      subscriptions: number;
    };
    metadata: FundingDealMetadata;
    createdAt: string;
    updatedAt: string;
  }>;
  count: number;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  required?: string[];
}

// ============================================
// Subscription API Types
// ============================================

export interface SubscribeFundingDealRequest {
  userId: string; // 임시: 실제로는 세션에서 가져옴
  quantity?: number; // 참여 수량 (기본값: 1)
}

export interface SubscribeFundingDealResponse {
  success: boolean;
  message: string;
  data: {
    subscription: {
      id: string;
      userId: string;
      fundingDealId: string;
      quantity: number;
      paidAmount: number;
      isUsed: boolean;
      usedAt: string | null;
      createdAt: string;
      updatedAt: string;
    };
    deal: {
      id: string;
      seasonName: string;
      targetCount: number;
      currentCount: number;
      discountedPrice: number;
      deadline: string;
      status: string;
      description: string | null;
      menuItem: {
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        restaurant: {
          id: string;
          name: string;
          address: string;
        };
      };
    };
    isGoalReached: boolean; // 목표 달성 여부
  };
}

export interface CheckSubscriptionResponse {
  success: boolean;
  isSubscribed: boolean;
  subscription: {
    id: string;
    userId: string;
    fundingDealId: string;
    quantity: number;
    paidAmount: number;
    isUsed: boolean;
    usedAt: string | null;
    createdAt: string;
    updatedAt: string;
    fundingDeal: {
      id: string;
      seasonName: string;
      status: string;
      deadline: string;
    };
  } | null;
}

// ============================================
// Funding Deal Detail API Types
// ============================================

export interface FundingDealDetailMetadata extends FundingDealMetadata {
  hoursRemaining: number; // 남은 시간 (시)
  savingsAmount: number; // 절약 금액
}

export interface GetFundingDealDetailResponse {
  success: boolean;
  data: {
    id: string;
    seasonName: string;
    targetCount: number;
    currentCount: number;
    discountedPrice: number;
    deadline: string;
    status: string;
    description: string | null;
    menuItem: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      isAvailable: boolean;
      restaurant: {
        id: string;
        name: string;
        address: string;
        phoneNumber: string | null;
        imageUrl: string | null;
        description: string | null;
      };
    };
    subscriptions: Array<{
      id: string;
      userId: string;
      quantity: number;
      createdAt: string;
      user: {
        id: string;
        name: string;
      };
    }>;
    _count: {
      subscriptions: number;
    };
    metadata: FundingDealDetailMetadata;
    createdAt: string;
    updatedAt: string;
  };
}

