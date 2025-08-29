import { Router } from 'express';
import { companionController } from '@/controllers/companionController';
import { authenticateToken, optionalAuth } from '@/middleware/auth';
import { validate, validateCompanion } from '@/middleware/validation';
import { body, param } from 'express-validator';

const router = Router();

// Public routes (with optional auth)
router.get('/public', companionController.getPublicCompanions);
router.get('/search', optionalAuth, companionController.searchCompanions);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

// CRUD operations
router.post('/', validate(validateCompanion), companionController.createCompanion);
router.get('/', companionController.getCompanions);

router.get('/:id', 
  validate([
    param('id').isString().withMessage('Companion ID must be a string'),
  ]),
  companionController.getCompanionById
);

router.put('/:id',
  validate([
    param('id').isString().withMessage('Companion ID must be a string'),
    ...validateCompanion,
  ]),
  companionController.updateCompanion
);

router.delete('/:id',
  validate([
    param('id').isString().withMessage('Companion ID must be a string'),
  ]),
  companionController.deleteCompanion
);

// Knowledge source management
router.post('/:id/sources',
  validate([
    param('id').isString().withMessage('Companion ID must be a string'),
    body('type')
      .isIn(['file', 'url'])
      .withMessage('Type must be either "file" or "url"'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
    body('sourceUrl')
      .optional()
      .isURL()
      .withMessage('Source URL must be a valid URL'),
    body('filePath')
      .optional()
      .isString()
      .withMessage('File path must be a string'),
    body('contentHash')
      .optional()
      .isString()
      .withMessage('Content hash must be a string'),
  ]),
  companionController.addKnowledgeSource
);

router.delete('/sources/:sourceId',
  validate([
    param('sourceId').isString().withMessage('Source ID must be a string'),
  ]),
  companionController.removeKnowledgeSource
);

// Companion testing
router.post('/:id/test',
  validate([
    param('id').isString().withMessage('Companion ID must be a string'),
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Test message must be between 1 and 1000 characters'),
  ]),
  companionController.testCompanion
);

export default router;
