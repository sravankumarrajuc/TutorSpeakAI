import { Request, Response } from 'express';
import { courseService } from '@/services/courseService';
import { logger } from '@/utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class CourseController {
  async createCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' },
        });
      }

      const course = await courseService.createCourse(userId, req.body);

      res.status(201).json({
        success: true,
        data: { course },
        message: 'Course created successfully',
      });
    } catch (error) {
      logger.error('Error in createCourse:', error);
      res.status(500).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to create course' },
      });
    }
  }

  async getCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' },
        });
      }

      const includePublic = req.query.includePublic === 'true';
      const courses = await courseService.getCourses(userId, includePublic);

      res.json({
        success: true,
        data: { courses },
      });
    } catch (error) {
      logger.error('Error in getCourses:', error);
      res.status(500).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch courses' },
      });
    }
  }

  async getCourseById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' },
        });
      }

      const { id } = req.params;
      const course = await courseService.getCourseById(id, userId);

      res.json({
        success: true,
        data: { course },
      });
    } catch (error) {
      logger.error('Error in getCourseById:', error);
      const statusCode = error instanceof Error && error.message === 'Course not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch course' },
      });
    }
  }

  async updateCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' },
        });
      }

      const { id } = req.params;
      const course = await courseService.updateCourse(id, userId, req.body);

      res.json({
        success: true,
        data: { course },
        message: 'Course updated successfully',
      });
    } catch (error) {
      logger.error('Error in updateCourse:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to update course' },
      });
    }
  }

  async deleteCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' },
        });
      }

      const { id } = req.params;
      await courseService.deleteCourse(id, userId);

      res.json({
        success: true,
        message: 'Course deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteCourse:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to delete course' },
      });
    }
  }

  async uploadDocuments(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' },
        });
      }

      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'No files uploaded' },
        });
      }

      const documents = await courseService.uploadDocuments(id, userId, files);

      res.json({
        success: true,
        data: { documents },
        message: 'Documents uploaded successfully',
      });
    } catch (error) {
      logger.error('Error in uploadDocuments:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to upload documents' },
      });
    }
  }

  async generateCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' },
        });
      }

      const { id } = req.params;
      const options = {
        courseId: id,
        generateNarration: req.body.generateNarration ?? true,
        generateAssessments: req.body.generateAssessments ?? true,
      };

      const result = await courseService.generateCourse(id, userId, options);

      res.json({
        success: true,
        data: result,
        message: 'Course generated successfully',
      });
    } catch (error) {
      logger.error('Error in generateCourse:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to generate course' },
      });
    }
  }
}

export const courseController = new CourseController();
