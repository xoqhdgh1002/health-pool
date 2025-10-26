import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">HealthPool</span>
            </Link>
          </div>

          {/* 내비게이션 링크 */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              홈
            </Link>
            <Link
              href="/deals"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-semibold"
            >
              펀딩 딜
            </Link>
            <Link
              href="/community"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-semibold"
            >
              커뮤니티
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              소개
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
            >
              로그인
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600"
              aria-label="메뉴 열기"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
