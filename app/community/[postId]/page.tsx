import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CommentForm from '@/components/community/CommentForm';

interface PageProps {
  params: {
    postId: string;
  };
}

// 게시글 상세 정보 가져오기
async function getPost(postId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/posts/${postId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.postId);

  if (!post) {
    return {
      title: '게시글을 찾을 수 없습니다 - HealthPool',
    };
  }

  return {
    title: `${post.title} - 커뮤니티 | HealthPool`,
    description: post.content.substring(0, 160),
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const post = await getPost(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 뒤로가기 */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/community"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
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
            목록으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 게시글 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* 헤더 */}
          <div className="px-6 py-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* 작성자 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* 조회수 */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
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
                    className="w-5 h-5"
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
            </div>
          </div>

          {/* 본문 */}
          <div className="px-6 py-8">
            {/* 이미지 */}
            {post.imageUrl && (
              <div className="mb-6">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* 내용 */}
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 댓글 헤더 */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">
              댓글 <span className="text-purple-600">{post.comments.length}</span>
            </h2>
          </div>

          {/* 댓글 작성 폼 */}
          <div className="px-6 py-6 border-b bg-gray-50">
            <CommentForm postId={post.id} />
          </div>

          {/* 댓글 목록 */}
          <div className="divide-y">
            {post.comments.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm mt-1">첫 번째 댓글을 작성해보세요!</p>
              </div>
            ) : (
              post.comments.map((comment: any) => (
                <div key={comment.id} className="px-6 py-6">
                  <div className="flex gap-4">
                    {/* 아바타 */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {comment.author.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* 댓글 내용 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
