import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './errorHandler';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));
    
    throw new ApiError(`Validation failed: ${errorMessages.map(e => e.message).join(', ')}`, 400);
  }
  next();
};

// Auth validation rules
export const validateRegister: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
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
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Companion validation rules
export const validateCompanion: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Companion name must be between 1 and 100 characters'),
  body('subjectDomain')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject domain must be less than 100 characters'),
  body('systemPrompt')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('System prompt must be between 10 and 2000 characters'),
  body('voiceId')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Voice ID must be less than 100 characters'),
  body('speakingStyle')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Speaking style must be less than 50 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
];

// Course validation rules
export const validateCourse: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Course title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Course description must be less than 1000 characters'),
  body('subjectDomain')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject domain must be less than 100 characters'),
  body('difficultyLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty level must be beginner, intermediate, or advanced'),
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer'),
  body('companionId')
    .optional()
    .isString()
    .withMessage('Companion ID must be a string'),
];

// Chapter validation rules
export const validateChapter: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Chapter title must be between 1 and 255 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Chapter content must be at least 10 characters'),
  body('orderIndex')
    .isInt({ min: 0 })
    .withMessage('Order index must be a non-negative integer'),
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer'),
];

// Assessment validation rules
export const validateAssessment: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Assessment title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Assessment description must be less than 1000 characters'),
  body('type')
    .isIn(['quiz', 'test', 'assignment'])
    .withMessage('Assessment type must be quiz, test, or assignment'),
  body('timeLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Time limit must be a positive integer'),
  body('passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),
  body('isVoiceGuided')
    .optional()
    .isBoolean()
    .withMessage('isVoiceGuided must be a boolean'),
];

// Question validation rules
export const validateQuestion: ValidationChain[] = [
  body('questionText')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Question text must be between 1 and 1000 characters'),
  body('questionType')
    .isIn(['multiple_choice', 'true_false', 'short_answer', 'essay'])
    .withMessage('Question type must be multiple_choice, true_false, short_answer, or essay'),
  body('correctAnswer')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Correct answer is required'),
  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Explanation must be less than 500 characters'),
  body('points')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Points must be a positive integer'),
  body('orderIndex')
    .isInt({ min: 0 })
    .withMessage('Order index must be a non-negative integer'),
];

export const validate = (validations: ValidationChain[]) => {
  return [...validations, handleValidationErrors];
};
