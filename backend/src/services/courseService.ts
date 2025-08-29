import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

// Local type definitions to avoid import path issues
interface CreateCourseRequest {
  title: string;
  description?: string;
  subjectDomain?: string;
  difficultyLevel?: string;
  estimatedDuration?: number;
  isPublic?: boolean;
  companionId?: string;
}

interface UpdateCourseRequest {
  title?: string;
  description?: string;
  subjectDomain?: string;
  difficultyLevel?: string;
  estimatedDuration?: number;
  isPublic?: boolean;
  companionId?: string;
}

interface GenerateCourseRequest {
  courseId: string;
  generateNarration?: boolean;
  generateAssessments?: boolean;
}

const prisma = new PrismaClient();

export class CourseService {
  async createCourse(userId: string, data: CreateCourseRequest) {
    try {
      const course = await prisma.course.create({
        data: {
          ...data,
          userId,
          status: 'draft',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          companion: {
            select: {
              id: true,
              name: true,
            },
          },
          chapters: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
          documents: true,
          _count: {
            select: {
              chapters: true,
              assessments: true,
              userProgress: true,
            },
          },
        },
      });

      logger.info(`Course created: ${course.id} by user: ${userId}`);
      return course;
    } catch (error) {
      logger.error('Error creating course:', error);
      throw new Error('Failed to create course');
    }
  }

  async getCourses(userId: string, includePublic = false) {
    try {
      const whereClause = includePublic 
        ? { OR: [{ userId }, { isPublic: true }] }
        : { userId };

      const courses = await prisma.course.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          companion: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              chapters: true,
              assessments: true,
              userProgress: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return courses;
    } catch (error) {
      logger.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  async getCourseById(courseId: string, userId: string) {
    try {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          OR: [
            { userId },
            { isPublic: true },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          companion: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          chapters: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
          documents: true,
          assessments: {
            include: {
              questions: true,
            },
          },
          userProgress: {
            where: {
              userId,
            },
          },
          _count: {
            select: {
              chapters: true,
              assessments: true,
              userProgress: true,
            },
          },
        },
      });

      if (!course) {
        throw new Error('Course not found');
      }

      return course;
    } catch (error) {
      logger.error('Error fetching course:', error);
      throw error;
    }
  }

  async updateCourse(courseId: string, userId: string, data: UpdateCourseRequest) {
    try {
      // Verify ownership
      const existingCourse = await prisma.course.findFirst({
        where: {
          id: courseId,
          userId,
        },
      });

      if (!existingCourse) {
        throw new Error('Course not found or access denied');
      }

      const course = await prisma.course.update({
        where: {
          id: courseId,
        },
        data,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          companion: {
            select: {
              id: true,
              name: true,
            },
          },
          chapters: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
          documents: true,
          _count: {
            select: {
              chapters: true,
              assessments: true,
              userProgress: true,
            },
          },
        },
      });

      logger.info(`Course updated: ${courseId} by user: ${userId}`);
      return course;
    } catch (error) {
      logger.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(courseId: string, userId: string) {
    try {
      // Verify ownership
      const existingCourse = await prisma.course.findFirst({
        where: {
          id: courseId,
          userId,
        },
      });

      if (!existingCourse) {
        throw new Error('Course not found or access denied');
      }

      await prisma.course.delete({
        where: {
          id: courseId,
        },
      });

      logger.info(`Course deleted: ${courseId} by user: ${userId}`);
    } catch (error) {
      logger.error('Error deleting course:', error);
      throw error;
    }
  }

  async uploadDocuments(courseId: string, userId: string, files: Express.Multer.File[]) {
    try {
      // Verify course ownership
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          userId,
        },
      });

      if (!course) {
        throw new Error('Course not found or access denied');
      }

      const documents = await Promise.all(
        files.map(async (file) => {
          return prisma.courseDocument.create({
            data: {
              courseId,
              originalFilename: file.originalname,
              filePath: file.path,
              fileType: file.mimetype,
              fileSize: file.size,
              processingStatus: 'pending',
            },
          });
        })
      );

      logger.info(`Documents uploaded for course: ${courseId}, count: ${files.length}`);
      
      // TODO: Process documents asynchronously for content extraction
      this.processDocumentsAsync(documents);

      return documents;
    } catch (error) {
      logger.error('Error uploading documents:', error);
      throw error;
    }
  }

  async generateCourse(courseId: string, userId: string, options: GenerateCourseRequest) {
    try {
      // Verify course ownership
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          userId,
        },
        include: {
          documents: {
            where: {
              processingStatus: 'completed',
            },
          },
        },
      });

      if (!course) {
        throw new Error('Course not found or access denied');
      }

      // Update course status to generating
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          status: 'generating',
        },
      });

      logger.info(`Starting course generation for: ${courseId}`);

      // TODO: Implement AI-powered course generation
      // This is a placeholder implementation
      const generatedContent = await this.generateCourseContent(course, options);

      // Create chapters from generated content
      const chapters = await this.createChaptersFromContent(courseId, generatedContent.chapters);

      // Generate assessments if requested
      let assessments: any[] = [];
      if (options.generateAssessments) {
        assessments = await this.generateAssessments(courseId, generatedContent.chapters);
      }

      // Update course status to completed
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          status: 'completed',
        },
      });

      logger.info(`Course generation completed for: ${courseId}`);

      return {
        course,
        chapters,
        assessments,
      };
    } catch (error) {
      logger.error('Error generating course:', error);
      
      // Update course status to error
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          status: 'error',
        },
      });

      throw error;
    }
  }

  private async processDocumentsAsync(documents: any[]) {
    // TODO: Implement document processing (OCR, text extraction, etc.)
    // This would typically be done in a background job
    for (const doc of documents) {
      try {
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await prisma.courseDocument.update({
          where: {
            id: doc.id,
          },
          data: {
            processingStatus: 'completed',
            extractedContent: 'Sample extracted content from document processing',
          },
        });
      } catch (error) {
        logger.error(`Error processing document ${doc.id}:`, error);
        await prisma.courseDocument.update({
          where: {
            id: doc.id,
          },
          data: {
            processingStatus: 'error',
          },
        });
      }
    }
  }

  private async generateCourseContent(course: any, options: GenerateCourseRequest) {
    // TODO: Implement AI integration (OpenAI, Claude, etc.)
    // This is a placeholder implementation
    
    const sampleChapters = [
      {
        title: 'Introduction to ' + course.title,
        content: `Welcome to ${course.title}. This chapter provides an overview of what you'll learn in this course.`,
        orderIndex: 0,
        estimatedDuration: 15,
      },
      {
        title: 'Core Concepts',
        content: `In this chapter, we'll explore the fundamental concepts of ${course.subjectDomain || 'the subject'}.`,
        orderIndex: 1,
        estimatedDuration: 30,
      },
      {
        title: 'Practical Applications',
        content: 'This chapter focuses on real-world applications and hands-on exercises.',
        orderIndex: 2,
        estimatedDuration: 45,
      },
    ];

    return {
      chapters: sampleChapters,
    };
  }

  private async createChaptersFromContent(courseId: string, chaptersData: any[]) {
    const chapters = await Promise.all(
      chaptersData.map(async (chapterData) => {
        return prisma.chapter.create({
          data: {
            ...chapterData,
            courseId,
          },
        });
      })
    );

    return chapters;
  }

  private async generateAssessments(courseId: string, chapters: any[]) {
    // TODO: Implement AI-powered assessment generation
    // This is a placeholder implementation
    
    const assessment = await prisma.assessment.create({
      data: {
        courseId,
        title: 'Course Assessment',
        description: 'Test your knowledge of the course material',
        type: 'quiz',
        timeLimit: 30,
        passingScore: 70,
      },
    });

    // Create sample questions
    const questions = await Promise.all([
      prisma.question.create({
        data: {
          assessmentId: assessment.id,
          questionText: 'What is the main topic of this course?',
          questionType: 'multiple_choice',
          options: JSON.stringify([
            'Option A',
            'Option B', 
            'Option C',
            'Option D'
          ]),
          correctAnswer: 'Option A',
          explanation: 'This is the correct answer because...',
          points: 1,
          orderIndex: 0,
        },
      }),
    ]);

    return [{ ...assessment, questions }];
  }
}

export const courseService = new CourseService();
