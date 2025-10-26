import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/deals/[dealId] - 특정 펀딩 딜 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;

    const fundingDeal = await prisma.fundingDeal.findUnique({
      where: { id: dealId },
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
        subscriptions: {
          select: {
            id: true,
            userId: true,
            quantity: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // 최근 10명의 참여자만
        },
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!fundingDeal) {
      return NextResponse.json(
        { error: 'Funding deal not found' },
        { status: 404 }
      );
    }

    // 메타데이터 계산
    const participationRate = (fundingDeal.currentCount / fundingDeal.targetCount) * 100;
    const remainingCount = fundingDeal.targetCount - fundingDeal.currentCount;
    const discountRate = fundingDeal.menuItem.price > 0
      ? Math.round(((fundingDeal.menuItem.price - fundingDeal.discountedPrice) / fundingDeal.menuItem.price) * 100)
      : 0;
    const timeRemaining = fundingDeal.deadline.getTime() - new Date().getTime();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60));

    const result = {
      ...fundingDeal,
      metadata: {
        participationRate: Math.round(participationRate * 10) / 10,
        remainingCount,
        discountRate,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        hoursRemaining: hoursRemaining > 0 ? hoursRemaining : 0,
        isAlmostFull: participationRate >= 80,
        isExpiringSoon: daysRemaining <= 3 && daysRemaining > 0,
        savingsAmount: fundingDeal.menuItem.price - fundingDeal.discountedPrice,
      },
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching funding deal:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
