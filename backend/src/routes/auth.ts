import { Router } from 'express';
import { authController } from '@/controllers/authController';
import { authenticateToken } from '@/middleware/auth';
import { validate, validateRegister, validateLogin } from '@/middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/health', authController.healthCheck);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/me', authController.getProfile);
router.put('/profile', 
  validate([
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('avatarUrl')
      .optional()
      .isURL()
      .withMessage('Avatar URL must be a valid URL'),
  ]),
  authController.updateProfile
);

router.put('/password',
  validate([
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  ]),
  authController.changePassword
);

router.post('/logout', authController.logout);

export default router;
