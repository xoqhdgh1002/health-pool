'use client';

import Link from 'next/link';

interface DealCardProps {
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
    metadata: {
      participationRate: number;
      remainingCount: number;
      discountRate: number;
      daysRemaining: number;
      isAlmostFull: boolean;
      isExpiringSoon: boolean;
    };
  };
}

export default function DealCard({ deal }: DealCardProps) {
  const { menuItem, metadata } = deal;

  // 상태 배지 결정
  const getStatusBadge = () => {
    if (metadata.isExpiringSoon) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ⏰ 마감 임박
        </span>
      );
    }
    if (metadata.isAlmostFull) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          🔥 거의 마감
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✓ 참여 가능
      </span>
    );
  };

  // 진행률 바 색상
  const getProgressBarColor = () => {
    if (metadata.participationRate >= 80) return 'bg-yellow-500';
    if (metadata.participationRate >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* 이미지 섹션 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        {menuItem.imageUrl ? (
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-20 h-20 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        )}

        {/* 할인율 배지 */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white shadow-lg">
            {metadata.discountRate}% 할인
          </span>
        </div>

        {/* 상태 배지 */}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>
      </div>

      {/* 내용 섹션 */}
      <div className="p-5">
        {/* 가게 이름 */}
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-sm text-gray-600 font-medium">
            {menuItem.restaurant.name}
          </span>
        </div>

        {/* 메뉴 이름 */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {menuItem.name}
        </h3>

        {/* 시즌 이름 */}
        {deal.seasonName && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {deal.seasonName}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">
              {deal.discountedPrice.toLocaleString()}원
            </span>
            <span className="text-sm text-gray-400 line-through">
              {menuItem.price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 참여 현황 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {deal.currentCount}명 참여 중
            </span>
            <span className="text-sm text-gray-500">
              목표: {deal.targetCount}명
            </span>
          </div>

          {/* 진행률 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(metadata.participationRate, 100)}%` }}
            ></div>
          </div>

          <div className="mt-1 text-xs text-gray-500">
            {metadata.participationRate.toFixed(1)}% 달성 • 남은 자리: {metadata.remainingCount}명
          </div>
        </div>

        {/* 마감 정보 */}
        <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {metadata.daysRemaining === 0
              ? '오늘 마감'
              : metadata.daysRemaining === 1
              ? '내일 마감'
              : `${metadata.daysRemaining}일 남음`}
          </span>
        </div>

        {/* 버튼 */}
        <Link
          href={`/deals/${deal.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          자세히 보기 / 참여하기
        </Link>
      </div>
    </div>
  );
}
