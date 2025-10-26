import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">HealthPool</h3>
            <p className="text-sm mb-4">
              건강한 삶을 위한 통합 건강 관리 플랫폼
            </p>
            <p className="text-sm">
              <strong>주소:</strong> 서울특별시 강남구 테헤란로 123
            </p>
            <p className="text-sm">
              <strong>대표전화:</strong> 02-1234-5678
            </p>
            <p className="text-sm">
              <strong>이메일:</strong> contact@healthpool.com
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">빠른 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors duration-200">
                  서비스
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors duration-200">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 정보 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">법적 정보</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/location-terms" className="hover:text-white transition-colors duration-200">
                  위치기반서비스 이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} HealthPool. All rights reserved.</p>
          <p className="mt-2 text-xs">
            사업자등록번호: 123-45-67890 | 대표이사: 홍길동
          </p>
        </div>
      </div>
    </footer>
  );
}
