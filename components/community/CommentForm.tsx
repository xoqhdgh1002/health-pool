'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    if (content.length < 2) {
      setError('댓글은 최소 2자 이상이어야 합니다.');
      return;
    }

    if (content.length > 1000) {
      setError('댓글은 최대 1000자까지 입력할 수 있습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 임시 userId (실제로는 세션/JWT에서 가져와야 함)
      const userId = 'temp-user-id-12345';

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 성공: 입력 초기화 및 페이지 새로고침
        setContent('');
        router.refresh();
      } else {
        // 실패: 에러 메시지 표시
        setError(data.error || '댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 텍스트 영역 */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {content.length} / 1000
          </span>
          {error && (
            <span className="text-sm text-red-600">
              {error}
            </span>
          )}
        </div>
      </div>

      {/* 작성 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isLoading || !content.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              작성 중...
            </span>
          ) : (
            '댓글 작성'
          )}
        </button>
      </div>
    </form>
  );
}
