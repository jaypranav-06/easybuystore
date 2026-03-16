import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the session using NextAuth
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to vote' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    if (session.user.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin users cannot vote on reviews' },
        { status: 403 }
      );
    }

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: { email: session.user.email || '' },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { reviewId, voteType } = body;

    // Validate input
    if (!reviewId || typeof reviewId !== 'number') {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    if (!voteType || !['helpful', 'unhelpful'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Vote type must be "helpful" or "unhelpful"' },
        { status: 400 }
      );
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user has already voted
    const existingVote = await prisma.reviewVote.findUnique({
      where: {
        review_id_user_id: {
          review_id: reviewId,
          user_id: user.user_id,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this review' },
        { status: 400 }
      );
    }

    // Create the vote and update counts in a transaction
    await prisma.$transaction([
      // Create the vote
      prisma.reviewVote.create({
        data: {
          review_id: reviewId,
          user_id: user.user_id,
          vote_type: voteType,
        },
      }),
      // Update the review counts
      prisma.review.update({
        where: { id: reviewId },
        data: {
          helpful_count: {
            increment: voteType === 'helpful' ? 1 : 0,
          },
          unhelpful_count: {
            increment: voteType === 'unhelpful' ? 1 : 0,
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: 'Vote recorded successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
