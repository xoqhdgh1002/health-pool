import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '커뮤니티 - HealthPool',
  description: '건강한 삶을 위한 정보를 공유하고 소통하세요',
};

// 게시글 목록 가져오기
async function getPosts(page: number = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/posts?page=${page}&limit=20`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [], pagination: null };
  }
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { data: posts, pagination } = await getPosts(page);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">커뮤니티</h1>
          <p className="text-xl text-purple-100">
            건강한 삶을 위한 정보를 공유하고 소통하세요
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 게시글 작성 버튼 */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              총 <span className="font-semibold text-purple-600">{pagination?.totalCount || 0}</span>개의 게시글
            </p>
          </div>
          <Link
            href="/community/new"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            글쓰기
          </Link>
        </div>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              아직 게시글이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              첫 번째 게시글을 작성해보세요!
            </p>
            <Link
              href="/community/new"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              글쓰기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b font-semibold text-gray-700">
              <div className="col-span-6">제목</div>
              <div className="col-span-2">작성자</div>
              <div className="col-span-2">작성일</div>
              <div className="col-span-2 text-center">조회/댓글</div>
            </div>

            {/* 게시글 목록 */}
            <div className="divide-y">
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* 제목 */}
                  <div className="md:col-span-6">
                    <h3 className="font-medium text-gray-900 hover:text-purple-600 line-clamp-1">
                      {post.title}
                    </h3>
                    {post.imageUrl && (
                      <span className="inline-flex items-center text-xs text-gray-500 mt-1">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        이미지
                      </span>
                    )}
                  </div>

                  {/* 작성자 */}
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-semibold text-sm">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-700 text-sm md:text-base">
                      {post.author.name}
                    </span>
                  </div>

                  {/* 작성일 */}
                  <div className="md:col-span-2 text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </div>

                  {/* 조회/댓글 */}
                  <div className="md:col-span-2 flex items-center justify-start md:justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {post._count.comments}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 페이지네이션 */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {/* 이전 페이지 */}
            {pagination.hasPrev && (
              <Link
                href={`/community?page=${page - 1}`}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              >
                이전
              </Link>
            )}

            {/* 페이지 번호 */}
            <div className="flex gap-2">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`/community?page=${pageNum}`}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pageNum === page
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {/* 다음 페이지 */}
            {pagination.hasNext && (
              <Link
                href={`/community?page=${page + 1}`}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              >
                다음
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
