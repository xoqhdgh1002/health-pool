import { Metadata } from 'next';
import DealCard from '@/components/deals/DealCard';

export const metadata: Metadata = {
  title: '펀딩 딜 목록 - HealthPool',
  description: '지금 참여할 수 있는 모든 펀딩 딜을 확인하세요',
};

// API에서 딜 목록 가져오기 (Server-Side Rendering)
async function getDeals() {
  try {
    // 개발 환경에서는 localhost 사용
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/deals?available=true`, {
      cache: 'no-store', // 항상 최신 데이터 가져오기
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">펀딩 딜</h1>
          <p className="text-xl text-blue-100">
            지금 참여 가능한 모든 딜을 확인하고 특별한 혜택을 받아보세요!
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
              <span>참여 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-red-400 rounded-full"></span>
              <span>마감 임박</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span>거의 마감</span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* 딜 개수 표시 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            현재 <span className="text-blue-600">{deals.length}개</span>의 딜이 진행 중입니다
          </h2>
        </div>

        {/* 딜 목록 */}
        {deals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              현재 진행 중인 딜이 없습니다
            </h3>
            <p className="text-gray-500">
              곧 새로운 딜이 등록될 예정이니 조금만 기다려주세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal: any) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
