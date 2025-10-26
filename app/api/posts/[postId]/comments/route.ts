import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/posts/[postId]/comments - 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const body = await request.json();
    const { content, userId } = body;

    // 입력값 검증
    if (!content || !userId) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['content', 'userId'],
        },
        { status: 400 }
      );
    }

    // 내용 길이 검증
    if (content.length < 2) {
      return NextResponse.json(
        { error: 'Content must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Content must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // 게시글 존재 확인
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 사용자 존재 확인
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Comment created successfully',
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/posts/[postId]/comments - 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    // 게시글 존재 확인
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 댓글 목록 조회
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // 오래된 순
      },
    });

    return NextResponse.json({
      success: true,
      data: comments,
      count: comments.length,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
