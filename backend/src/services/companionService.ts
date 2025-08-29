import prisma from '@/config/database';
import { ApiError } from '@/middleware/errorHandler';

export interface CreateCompanionData {
  name: string;
  subjectDomain?: string;
  systemPrompt: string;
  voiceId?: string;
  speakingStyle?: string;
  isPublic?: boolean;
}

export interface UpdateCompanionData {
  name?: string;
  subjectDomain?: string;
  systemPrompt?: string;
  voiceId?: string;
  speakingStyle?: string;
  isPublic?: boolean;
  avatarUrl?: string;
}

export class CompanionService {
  async createCompanion(userId: string, data: CreateCompanionData) {
    const companion = await prisma.companion.create({
      data: {
        userId,
        name: data.name,
        subjectDomain: data.subjectDomain,
        systemPrompt: data.systemPrompt,
        voiceId: data.voiceId || 'alloy',
        speakingStyle: data.speakingStyle || 'conversational',
        isPublic: data.isPublic || false,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            courses: true,
            sessions: true,
            knowledgeSources: true,
          },
        },
      },
    });

    return companion;
  }

  async getCompanionsByUser(userId: string, includePublic: boolean = false) {
    const whereClause = includePublic
      ? {
          OR: [
            { userId },
            { isPublic: true },
          ],
        }
      : { userId };

    const companions = await prisma.companion.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            courses: true,
            sessions: true,
            knowledgeSources: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return companions;
  }

  async getCompanionById(companionId: string, userId?: string) {
    const companion = await prisma.companion.findUnique({
      where: { id: companionId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        courses: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        knowledgeSources: {
          select: {
            id: true,
            type: true,
            title: true,
            sourceUrl: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!companion) {
      throw new ApiError('Companion not found', 404);
    }

    // Check if user has access to this companion
    if (userId && companion.userId !== userId && !companion.isPublic) {
      throw new ApiError('Access denied', 403);
    }

    return companion;
  }

  async updateCompanion(companionId: string, userId: string, data: UpdateCompanionData) {
    // First check if companion exists and user owns it
    const existingCompanion = await prisma.companion.findUnique({
      where: { id: companionId },
      select: { userId: true },
    });

    if (!existingCompanion) {
      throw new ApiError('Companion not found', 404);
    }

    if (existingCompanion.userId !== userId) {
      throw new ApiError('Access denied', 403);
    }

    const companion = await prisma.companion.update({
      where: { id: companionId },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            courses: true,
            sessions: true,
            knowledgeSources: true,
          },
        },
      },
    });

    return companion;
  }

  async deleteCompanion(companionId: string, userId: string) {
    // First check if companion exists and user owns it
    const existingCompanion = await prisma.companion.findUnique({
      where: { id: companionId },
      select: { userId: true },
    });

    if (!existingCompanion) {
      throw new ApiError('Companion not found', 404);
    }

    if (existingCompanion.userId !== userId) {
      throw new ApiError('Access denied', 403);
    }

    await prisma.companion.delete({
      where: { id: companionId },
    });

    return { message: 'Companion deleted successfully' };
  }

  async addKnowledgeSource(companionId: string, userId: string, data: {
    type: 'file' | 'url';
    title?: string;
    sourceUrl?: string;
    filePath?: string;
    contentHash?: string;
  }) {
    // Check if user owns the companion
    const companion = await prisma.companion.findUnique({
      where: { id: companionId },
      select: { userId: true },
    });

    if (!companion) {
      throw new ApiError('Companion not found', 404);
    }

    if (companion.userId !== userId) {
      throw new ApiError('Access denied', 403);
    }

    const knowledgeSource = await prisma.knowledgeSource.create({
      data: {
        companionId,
        type: data.type,
        title: data.title,
        sourceUrl: data.sourceUrl,
        filePath: data.filePath,
        contentHash: data.contentHash,
      },
    });

    return knowledgeSource;
  }

  async removeKnowledgeSource(sourceId: string, userId: string) {
    // Check if user owns the companion that owns this knowledge source
    const knowledgeSource = await prisma.knowledgeSource.findUnique({
      where: { id: sourceId },
      include: {
        companion: {
          select: { userId: true },
        },
      },
    });

    if (!knowledgeSource) {
      throw new ApiError('Knowledge source not found', 404);
    }

    if (knowledgeSource.companion.userId !== userId) {
      throw new ApiError('Access denied', 403);
    }

    await prisma.knowledgeSource.delete({
      where: { id: sourceId },
    });

    return { message: 'Knowledge source removed successfully' };
  }

  async getPublicCompanions(limit: number = 20, offset: number = 0) {
    const companions = await prisma.companion.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            courses: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.companion.count({
      where: { isPublic: true },
    });

    return {
      companions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async searchCompanions(query: string, userId?: string, includePublic: boolean = true) {
    const whereClause = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { subjectDomain: { contains: query, mode: 'insensitive' as const } },
          ],
        },
        includePublic
          ? {
              OR: [
                { userId },
                { isPublic: true },
              ],
            }
          : { userId },
      ],
    };

    const companions = await prisma.companion.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            courses: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return companions;
  }
}

export const companionService = new CompanionService();
