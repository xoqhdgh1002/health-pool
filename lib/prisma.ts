import { PrismaClient } from '@prisma/client';

// PrismaClient를 전역 변수로 선언 (TypeScript용)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prisma Client 싱글톤 인스턴스
// 개발 환경에서 Hot Reload 시 여러 인스턴스가 생성되는 것을 방지
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
