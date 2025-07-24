import express from 'express';
import { body } from 'express-validator';
import {
  getSubmissionsByAssignment,
  getMySubmissions,
  submitAssignment,
  updateSubmission,
  gradeSubmission
} from '../controllers/submissionController';
import { authenticateJWT, requireTeacher, requireStudent } from '../middleware/auth';
import { uploadMultiple } from '../utils/fileUpload';

const router = express.Router();

// Validation middleware
const submissionValidation = [
  body('assignmentId')
    .isMongoId()
    .withMessage('Valid assignment ID is required'),
  body('files')
    .optional()
    .isArray()
    .withMessage('Files must be an array')
];

const gradingValidation = [
  body('score')
    .isInt({ min: 0 })
    .withMessage('Score must be a non-negative integer'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feedback cannot exceed 1000 characters')
];

// Routes
router.get('/assignment/:assignmentId', authenticateJWT, getSubmissionsByAssignment);
router.get('/my', authenticateJWT, requireStudent, getMySubmissions);
router.post('/', authenticateJWT, requireStudent, uploadMultiple, submissionValidation, submitAssignment);
router.put('/:id', authenticateJWT, requireStudent, uploadMultiple, submissionValidation, updateSubmission);
router.put('/:id/grade', authenticateJWT, requireTeacher, gradingValidation, gradeSubmission);

export default router;