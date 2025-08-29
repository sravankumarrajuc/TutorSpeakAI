import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '@/middleware/auth';
import { validate, validateCourse } from '@/middleware/validation';
import { param } from 'express-validator';
import { courseController } from '@/controllers/courseController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.pptx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, PPTX, and TXT files are allowed.'));
    }
  },
});

// CRUD operations
router.post('/', validate(validateCourse), courseController.createCourse.bind(courseController));
router.get('/', courseController.getCourses.bind(courseController));

router.get('/:id',
  validate([
    param('id').isString().withMessage('Course ID must be a string'),
  ]),
  courseController.getCourseById.bind(courseController)
);

router.put('/:id',
  validate([
    param('id').isString().withMessage('Course ID must be a string'),
    ...validateCourse,
  ]),
  courseController.updateCourse.bind(courseController)
);

router.delete('/:id',
  validate([
    param('id').isString().withMessage('Course ID must be a string'),
  ]),
  courseController.deleteCourse.bind(courseController)
);

// Document upload and processing
router.post('/:id/documents',
  validate([
    param('id').isString().withMessage('Course ID must be a string'),
  ]),
  upload.array('documents', 10), // Allow up to 10 files
  courseController.uploadDocuments.bind(courseController)
);

// AI-powered course generation
router.post('/:id/generate',
  validate([
    param('id').isString().withMessage('Course ID must be a string'),
  ]),
  courseController.generateCourse.bind(courseController)
);

export default router;
