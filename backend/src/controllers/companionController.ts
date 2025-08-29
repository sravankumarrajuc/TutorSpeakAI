import { Request, Response } from 'express';
import { companionService } from '@/services/companionService';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

export class CompanionController {
  createCompanion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { name, subjectDomain, systemPrompt, voiceId, speakingStyle, isPublic } = req.body;

    const companion = await companionService.createCompanion(userId, {
      name,
      subjectDomain,
      systemPrompt,
      voiceId,
      speakingStyle,
      isPublic,
    });

    res.status(201).json({
      success: true,
      message: 'Companion created successfully',
      data: { companion },
    });
  });

  getCompanions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const includePublic = req.query.includePublic === 'true';

    const companions = await companionService.getCompanionsByUser(userId, includePublic);

    res.json({
      success: true,
      data: { companions },
    });
  });

  getCompanionById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const companion = await companionService.getCompanionById(id, userId);

    res.json({
      success: true,
      data: { companion },
    });
  });

  updateCompanion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const { name, subjectDomain, systemPrompt, voiceId, speakingStyle, isPublic, avatarUrl } = req.body;

    const companion = await companionService.updateCompanion(id, userId, {
      name,
      subjectDomain,
      systemPrompt,
      voiceId,
      speakingStyle,
      isPublic,
      avatarUrl,
    });

    res.json({
      success: true,
      message: 'Companion updated successfully',
      data: { companion },
    });
  });

  deleteCompanion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await companionService.deleteCompanion(id, userId);

    res.json({
      success: true,
      message: result.message,
    });
  });

  addKnowledgeSource = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const { type, title, sourceUrl, filePath, contentHash } = req.body;

    const knowledgeSource = await companionService.addKnowledgeSource(id, userId, {
      type,
      title,
      sourceUrl,
      filePath,
      contentHash,
    });

    res.status(201).json({
      success: true,
      message: 'Knowledge source added successfully',
      data: { knowledgeSource },
    });
  });

  removeKnowledgeSource = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { sourceId } = req.params;
    const userId = req.user!.id;

    const result = await companionService.removeKnowledgeSource(sourceId, userId);

    res.json({
      success: true,
      message: result.message,
    });
  });

  getPublicCompanions = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await companionService.getPublicCompanions(limit, offset);

    res.json({
      success: true,
      data: result,
    });
  });

  searchCompanions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q: query } = req.query;
    const userId = req.user?.id;
    const includePublic = req.query.includePublic !== 'false';

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Search query is required' },
      });
    }

    const companions = await companionService.searchCompanions(query, userId, includePublic);

    res.json({
      success: true,
      data: { companions },
    });
  });

  testCompanion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user!.id;

    // Get companion details
    const companion = await companionService.getCompanionById(id, userId);

    // In a real implementation, this would interact with the AI service
    // For now, we'll return a mock response
    const mockResponse = {
      companionId: id,
      companionName: companion.name,
      userMessage: message,
      aiResponse: `Hello! I'm ${companion.name}, your AI companion specializing in ${companion.subjectDomain || 'general topics'}. How can I help you today?`,
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Companion test completed',
      data: mockResponse,
    });
  });
}

export const companionController = new CompanionController();
