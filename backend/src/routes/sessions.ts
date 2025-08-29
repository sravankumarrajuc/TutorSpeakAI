import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { param, body } from 'express-validator';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Placeholder controllers - will be implemented later
const sessionController = {
  createSession: (req: any, res: any) => {
    res.json({ success: true, message: 'Session creation endpoint - coming soon' });
  },
  getSessions: (req: any, res: any) => {
    res.json({ success: true, data: { sessions: [] }, message: 'Sessions endpoint - coming soon' });
  },
  getSessionById: (req: any, res: any) => {
    res.json({ success: true, message: 'Get session endpoint - coming soon' });
  },
  updateSession: (req: any, res: any) => {
    res.json({ success: true, message: 'Update session endpoint - coming soon' });
  },
  deleteSession: (req: any, res: any) => {
    res.json({ success: true, message: 'Delete session endpoint - coming soon' });
  },
  getTranscript: (req: any, res: any) => {
    res.json({ success: true, message: 'Get transcript endpoint - coming soon' });
  },
};

// CRUD operations
router.post('/',
  validate([
    body('companionId')
      .isString()
      .withMessage('Companion ID is required'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
  ]),
  sessionController.createSession
);

router.get('/', sessionController.getSessions);

router.get('/:id',
  validate([
    param('id').isString().withMessage('Session ID must be a string'),
  ]),
  sessionController.getSessionById
);

router.put('/:id',
  validate([
    param('id').isString().withMessage('Session ID must be a string'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
    body('status')
      .optional()
      .isIn(['active', 'completed', 'paused'])
      .withMessage('Status must be active, completed, or paused'),
  ]),
  sessionController.updateSession
);

router.delete('/:id',
  validate([
    param('id').isString().withMessage('Session ID must be a string'),
  ]),
  sessionController.deleteSession
);

// Session transcript
router.get('/:id/transcript',
  validate([
    param('id').isString().withMessage('Session ID must be a string'),
  ]),
  sessionController.getTranscript
);

export default router;
