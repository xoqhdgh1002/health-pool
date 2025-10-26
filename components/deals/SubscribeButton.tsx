'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubscribeButtonProps {
  dealId: string;
  dealStatus: string;
  isExpired: boolean;
  isFull: boolean;
}

export default function SubscribeButton({
  dealId,
  dealStatus,
  isExpired,
  isFull,
}: SubscribeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    type: 'success' as 'success' | 'error',
    message: '',
  });

  // 참여 불가능한 상태 체크
  const isDisabled =
    isLoading ||
    dealStatus !== 'ACTIVE' ||
    isExpired ||
    isFull;

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isLoading) return '처리 중...';
    if (dealStatus === 'SUCCESS') return '✓ 목표 달성 완료';
    if (dealStatus === 'FAILED') return '마감되었습니다';
    if (dealStatus === 'CLOSED') return '종료된 딜입니다';
    if (isExpired) return '마감 기한 초과';
    if (isFull) return '정원 마감';
    return '지금 참여하기';
  };

  // 알림 표시
  const showAlert = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setShowNotification(true);

    // 3초 후 자동 숨김
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // 참여하기 API 호출
  const handleSubscribe = async () => {
    // 임시 userId (실제로는 세션/JWT에서 가져와야 함)
    const userId = 'temp-user-id-12345';

    setIsLoading(true);

    try {
      const response = await fetch(`/api/deals/${dealId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 성공
        showAlert(
          'success',
          data.data.isGoalReached
            ? '🎉 참여 완료! 목표가 달성되었습니다!'
            : '✅ 펀딩 참여가 완료되었습니다!'
        );

        // 1초 후 페이지 새로고침 (업데이트된 데이터 표시)
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        // 실패
        let errorMessage = '참여에 실패했습니다.';

        if (response.status === 409) {
          errorMessage = '이미 참여하신 딜입니다.';
        } else if (response.status === 400) {
          errorMessage = data.error || '참여할 수 없는 상태입니다.';
        } else if (response.status === 404) {
          errorMessage = '딜을 찾을 수 없습니다.';
        }

        showAlert('error', errorMessage);
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      showAlert('error', '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 알림 토스트 */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`rounded-lg shadow-lg p-4 min-w-[300px] ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* 참여하기 버튼 */}
      <button
        onClick={handleSubscribe}
        disabled={isDisabled}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
      >
        {getButtonText()}
      </button>

      {/* 안내 메시지 */}
      {!isDisabled && (
        <p className="text-xs text-gray-500 text-center mt-2">
          클릭 한 번으로 간편하게 참여할 수 있습니다
        </p>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
