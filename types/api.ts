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
      price: number;
      restaurant: {
        id: string;
        name: string;
        address: string;
      };
    };
    _count: {
      subscriptions: number;
    };
  }>;
  count: number;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  required?: string[];
}
