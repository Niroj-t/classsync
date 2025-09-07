import express from 'express';
import { authenticateJWT, requireTeacher } from '../middleware/auth';
<<<<<<< HEAD
import { uploadMultiple } from '../utils/fileUpload';
=======
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
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
<<<<<<< HEAD
// Use upload middleware so multipart/form-data fields (including assignmentId) are parsed
router.post('/', authenticateJWT, uploadMultiple, submissionValidation, submitAssignment);
router.put('/:id', authenticateJWT, uploadMultiple, submissionValidation, updateSubmission);
=======
router.post('/', authenticateJWT, submissionValidation, submitAssignment);
router.put('/:id', authenticateJWT, submissionValidation, updateSubmission);
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473

export default router;