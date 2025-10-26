import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/deals/[dealId]/subscribe - 펀딩 딜에 참여
export async function POST(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const body = await request.json();
    const { userId, quantity = 1 } = body;

    // 입력값 검증
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!dealId) {
      return NextResponse.json(
        { error: 'dealId is required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // 트랜잭션으로 처리 (데이터 일관성 보장)
    const result = await prisma.$transaction(async (tx) => {
      // 1. FundingDeal 조회 및 검증
      const fundingDeal = await tx.fundingDeal.findUnique({
        where: { id: dealId },
        include: {
          menuItem: {
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!fundingDeal) {
        throw new Error('DEAL_NOT_FOUND');
      }

      // 딜이 ACTIVE 상태인지 확인
      if (fundingDeal.status !== 'ACTIVE') {
        throw new Error('DEAL_NOT_ACTIVE');
      }

      // 마감 기한이 지나지 않았는지 확인
      if (new Date(fundingDeal.deadline) <= new Date()) {
        throw new Error('DEAL_EXPIRED');
      }

      // 2. 이미 참여했는지 확인 (중복 참여 방지)
      const existingSubscription = await tx.subscription.findUnique({
        where: {
          userId_fundingDealId: {
            userId,
            fundingDealId: dealId,
          },
        },
      });

      if (existingSubscription) {
        throw new Error('ALREADY_SUBSCRIBED');
      }

      // 3. 정원 확인 (목표 인원 초과 방지)
      const remainingSpots = fundingDeal.targetCount - fundingDeal.currentCount;
      if (remainingSpots < quantity) {
        throw new Error('INSUFFICIENT_SPOTS');
      }

      // 4. Subscription 생성
      const subscription = await tx.subscription.create({
        data: {
          userId,
          fundingDealId: dealId,
          quantity,
          paidAmount: fundingDeal.discountedPrice * quantity,
          isUsed: false,
        },
      });

      // 5. FundingDeal의 currentCount 증가
      const newCurrentCount = fundingDeal.currentCount + quantity;
      const updatedDeal = await tx.fundingDeal.update({
        where: { id: dealId },
        data: {
          currentCount: newCurrentCount,
          // 목표 달성 시 상태를 SUCCESS로 변경
          status: newCurrentCount >= fundingDeal.targetCount ? 'SUCCESS' : 'ACTIVE',
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

      return {
        subscription,
        updatedDeal,
        isGoalReached: newCurrentCount >= fundingDeal.targetCount,
      };
    });

    // 성공 응답
    return NextResponse.json(
      {
        success: true,
        message: result.isGoalReached
          ? 'Successfully subscribed! This deal has reached its goal!'
          : 'Successfully subscribed to the funding deal',
        data: {
          subscription: result.subscription,
          deal: result.updatedDeal,
          isGoalReached: result.isGoalReached,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to funding deal:', error);

    // 비즈니스 로직 에러 처리
    if (error instanceof Error) {
      switch (error.message) {
        case 'DEAL_NOT_FOUND':
          return NextResponse.json(
            { error: 'Funding deal not found' },
            { status: 404 }
          );
        case 'DEAL_NOT_ACTIVE':
          return NextResponse.json(
            { error: 'This deal is not active anymore' },
            { status: 400 }
          );
        case 'DEAL_EXPIRED':
          return NextResponse.json(
            { error: 'This deal has expired' },
            { status: 400 }
          );
        case 'ALREADY_SUBSCRIBED':
          return NextResponse.json(
            { error: 'You have already subscribed to this deal' },
            { status: 409 }
          );
        case 'INSUFFICIENT_SPOTS':
          return NextResponse.json(
            { error: 'Not enough spots available for this quantity' },
            { status: 400 }
          );
      }
    }

    // 기타 에러
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/deals/[dealId]/subscribe - 사용자의 참여 여부 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // 참여 여부 확인
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_fundingDealId: {
          userId,
          fundingDealId: dealId,
        },
      },
      include: {
        fundingDeal: {
          select: {
            id: true,
            seasonName: true,
            status: true,
            deadline: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      isSubscribed: !!subscription,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
