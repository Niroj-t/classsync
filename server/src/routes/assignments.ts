import express from 'express';
import { body } from 'express-validator';
import {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController';
import { authenticateJWT, requireTeacher } from '../middleware/auth';
import { uploadMultiple } from '../utils/fileUpload';

const router = express.Router();

// Validation middleware
const assignmentValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('dueDate')
    .isISO8601()
    .withMessage('Please provide a valid due date'),
  body('maxScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Max score must be between 0 and 100'),
  body('instructions')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Instructions cannot exceed 1000 characters')
];

// Routes
router.get('/', authenticateJWT, getAssignments);
router.get('/:id', authenticateJWT, getAssignment);
router.post('/', authenticateJWT, requireTeacher, uploadMultiple, assignmentValidation, createAssignment);
router.put('/:id', authenticateJWT, requireTeacher, assignmentValidation, updateAssignment);
router.delete('/:id', authenticateJWT, requireTeacher, deleteAssignment);

export default router;