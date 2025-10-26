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
