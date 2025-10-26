import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/deals - 새로운 펀딩 딜 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 입력값 검증
    const {
      menuItemId,
      seasonName,
      targetCount,
      discountedPrice,
      deadline,
      description,
      userId, // 임시: 요청 본문에서 userId를 받음 (실제로는 세션/JWT에서 가져옴)
    } = body;

    // 필수 필드 검증
    if (!menuItemId || !targetCount || !deadline || !discountedPrice || !userId) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['menuItemId', 'targetCount', 'discountedPrice', 'deadline', 'userId'],
        },
        { status: 400 }
      );
    }

    // targetCount 유효성 검증
    if (targetCount <= 0) {
      return NextResponse.json(
        { error: 'targetCount must be greater than 0' },
        { status: 400 }
      );
    }

    // discountedPrice 유효성 검증
    if (discountedPrice <= 0) {
      return NextResponse.json(
        { error: 'discountedPrice must be greater than 0' },
        { status: 400 }
      );
    }

    // deadline 유효성 검증 (미래 날짜여야 함)
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      return NextResponse.json(
        { error: 'deadline must be a valid future date' },
        { status: 400 }
      );
    }

    // 1. 메뉴 아이템 존재 확인 및 사장님 권한 확인
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        restaurant: {
          select: {
            ownerId: true,
            name: true,
          },
        },
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // 사장님 권한 확인
    if (menuItem.restaurant.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You are not the owner of this restaurant' },
        { status: 403 }
      );
    }

    // 메뉴 아이템이 사용 가능한지 확인
    if (!menuItem.isAvailable) {
      return NextResponse.json(
        { error: 'Menu item is not available' },
        { status: 400 }
      );
    }

    // 2. 새로운 FundingDeal 생성
    const fundingDeal = await prisma.fundingDeal.create({
      data: {
        seasonName: seasonName || `${new Date().getFullYear()} 특별 딜`,
        targetCount,
        currentCount: 0,
        discountedPrice,
        deadline: deadlineDate,
        status: 'ACTIVE', // 모집 중
        description: description || null,
        menuItemId,
      },
      include: {
        menuItem: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    // 3. 생성된 딜 정보 반환
    return NextResponse.json(
      {
        success: true,
        message: 'Funding deal created successfully',
        data: fundingDeal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating funding deal:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/deals - 펀딩 딜 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const restaurantId = searchParams.get('restaurantId');
    const available = searchParams.get('available'); // 'true'면 참여 가능한 딜만

    // 필터 조건 구성
    const where: any = {};

    // available=true인 경우: 현재 참여 가능한 딜만 조회
    // (ACTIVE 상태 + 마감 기한이 지나지 않음)
    if (available === 'true') {
      where.status = 'ACTIVE';
      where.deadline = {
        gte: new Date(), // 마감 기한이 현재 시간보다 미래
      };
    } else if (status) {
      // available이 아닌 경우 status 파라미터 사용
      where.status = status;
    }

    // 특정 가게의 딜만 조회
    if (restaurantId) {
      where.menuItem = {
        restaurant: {
          id: restaurantId,
        },
      };
    }

    const fundingDeals = await prisma.fundingDeal.findMany({
      where,
      include: {
        menuItem: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                address: true,
                phoneNumber: true,
                imageUrl: true,
                description: true,
              },
            },
          },
        },
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
      orderBy: [
        { deadline: 'asc' }, // 마감 임박한 순
        { createdAt: 'desc' }, // 최신순
      ],
    });

    // 각 딜에 추가 정보 계산
    const dealsWithMetadata = fundingDeals.map((deal) => {
      const participationRate = (deal.currentCount / deal.targetCount) * 100;
      const remainingCount = deal.targetCount - deal.currentCount;
      const discountRate = deal.menuItem.price > 0
        ? Math.round(((deal.menuItem.price - deal.discountedPrice) / deal.menuItem.price) * 100)
        : 0;
      const timeRemaining = deal.deadline.getTime() - new Date().getTime();
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

      return {
        ...deal,
        metadata: {
          participationRate: Math.round(participationRate * 10) / 10, // 소수점 1자리
          remainingCount,
          discountRate,
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          isAlmostFull: participationRate >= 80,
          isExpiringSoon: daysRemaining <= 3 && daysRemaining > 0,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: dealsWithMetadata,
      count: dealsWithMetadata.length,
    });
  } catch (error) {
    console.error('Error fetching funding deals:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
