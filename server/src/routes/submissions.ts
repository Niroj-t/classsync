import express from 'express';
import { authenticateJWT, requireTeacher } from '../middleware/auth';
import { 
  getSubmissionsByAssignment, 
  getMySubmissions, 
  submitAssignment, 
  updateSubmission 
} from '../controllers/submissionController';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const submissionValidation = [
  body('text').optional().trim().isLength({ min: 1 }).withMessage('Text cannot be empty'),
  body('files').optional().isArray().withMessage('Files must be an array')
];

// Routes
router.get('/assignment/:assignmentId', authenticateJWT, getSubmissionsByAssignment);
router.get('/my', authenticateJWT, getMySubmissions);
router.post('/', authenticateJWT, submissionValidation, submitAssignment);
router.put('/:id', authenticateJWT, submissionValidation, updateSubmission);

export default router;