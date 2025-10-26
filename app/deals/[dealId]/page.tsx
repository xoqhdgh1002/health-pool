import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SubscribeButton from '@/components/deals/SubscribeButton';

interface PageProps {
  params: {
    dealId: string;
  };
}

// 딜 상세 정보 가져오기
async function getDeal(dealId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/deals/${dealId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching deal:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const deal = await getDeal(params.dealId);

  if (!deal) {
    return {
      title: '펀딩 딜을 찾을 수 없습니다 - HealthPool',
    };
  }

  return {
    title: `${deal.menuItem.name} - ${deal.menuItem.restaurant.name} | HealthPool`,
    description: deal.description || `${deal.menuItem.restaurant.name}의 ${deal.menuItem.name} 펀딩 딜`,
  };
}

export default async function DealDetailPage({ params }: PageProps) {
  const deal = await getDeal(params.dealId);

  if (!deal) {
    notFound();
  }

  const { menuItem, metadata } = deal;

  // 진행률 바 색상
  const getProgressBarColor = () => {
    if (metadata.participationRate >= 80) return 'bg-yellow-500';
    if (metadata.participationRate >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 뒤로가기 */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/deals"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            펀딩 딜 목록으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 이미지 및 기본 정보 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 이미지 */}
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200">
                {menuItem.imageUrl ? (
                  <img
                    src={menuItem.imageUrl}
                    alt={menuItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                )}

                {/* 할인율 배지 */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-red-500 text-white shadow-lg">
                    {metadata.discountRate}% 할인
                  </span>
                </div>

                {/* 상태 배지 */}
                <div className="absolute top-4 left-4">
                  {deal.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                      ✓ 목표 달성
                    </span>
                  ) : metadata.isExpiringSoon ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      ⏰ 마감 임박
                    </span>
                  ) : metadata.isAlmostFull ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      🔥 거의 마감
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ 참여 가능
                    </span>
                  )}
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="p-6">
                {/* 시즌 이름 */}
                {deal.seasonName && (
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {deal.seasonName}
                  </p>
                )}

                {/* 메뉴 이름 */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {menuItem.name}
                </h1>

                {/* 가게 정보 */}
                <div className="flex items-center gap-2 mb-6">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  <Link
                    href={`/restaurants/${menuItem.restaurant.id}`}
                    className="text-lg text-gray-700 hover:text-blue-600 font-medium"
                  >
                    {menuItem.restaurant.name}
                  </Link>
                </div>

                {/* 가격 정보 */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">할인 가격</p>
                      <p className="text-4xl font-bold text-blue-600">
                        {deal.discountedPrice.toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 line-through mb-1">
                        원가: {menuItem.price.toLocaleString()}원
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        {metadata.savingsAmount.toLocaleString()}원 절약
                      </p>
                    </div>
                  </div>
                </div>

                {/* 메뉴 설명 */}
                {menuItem.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">메뉴 설명</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {menuItem.description}
                    </p>
                  </div>
                )}

                {/* 딜 설명 */}
                {deal.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">이번 딜 안내</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {deal.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 가게 정보 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">가게 정보</h2>

              <div className="space-y-4">
                {/* 주소 */}
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-gray-400 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">주소</p>
                    <p className="text-gray-900">{menuItem.restaurant.address}</p>
                  </div>
                </div>

                {/* 전화번호 */}
                {menuItem.restaurant.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-gray-400 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">전화번호</p>
                      <a
                        href={`tel:${menuItem.restaurant.phoneNumber}`}
                        className="text-blue-600 hover:underline"
                      >
                        {menuItem.restaurant.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {/* 가게 설명 */}
                {menuItem.restaurant.description && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-gray-400 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">소개</p>
                      <p className="text-gray-900">{menuItem.restaurant.description}</p>
                    </div>
                  </div>
                )}

                {/* 지도 영역 (임시) */}
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <p>지도 API 연동 예정</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 참여자 */}
            {deal.subscriptions && deal.subscriptions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  최근 참여자 ({deal._count.subscriptions}명)
                </h2>
                <div className="space-y-2">
                  {deal.subscriptions.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between py-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {sub.user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{sub.user.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(sub.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {sub.quantity}개 참여
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 - 참여 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">펀딩 현황</h2>

              {/* 진행률 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {deal.currentCount}명
                  </span>
                  <span className="text-gray-500">/ {deal.targetCount}명</span>
                </div>

                {/* 프로그레스 바 */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                    style={{ width: `${Math.min(metadata.participationRate, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>{metadata.participationRate.toFixed(1)}% 달성</span>
                  <span>남은 자리: {metadata.remainingCount}명</span>
                </div>
              </div>

              {/* 마감 정보 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <svg
                    className="w-5 h-5"
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
                  <span className="font-medium">마감까지</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metadata.daysRemaining === 0
                    ? `${metadata.hoursRemaining}시간`
                    : `${metadata.daysRemaining}일`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(deal.deadline).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* 참여하기 버튼 */}
              <SubscribeButton
                dealId={deal.id}
                dealStatus={deal.status}
                isExpired={metadata.daysRemaining <= 0}
                isFull={metadata.remainingCount <= 0}
              />

              {/* 추가 정보 */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>목표 달성 시 자동 적용</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>쿠폰으로 간편하게 사용</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>안전한 거래 보장</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
