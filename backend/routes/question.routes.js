import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
    addQuestion,
    getQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} from '../controllers/question.controller.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(verifyToken);

// User routes
router.post('/', addQuestion);  
router.get('/my-questions', getQuestions);  
router.get('/my-questions/:id', getQuestionById);  
router.put('/:id', updateQuestion);  
router.delete('/:id', deleteQuestion);  

// Admin route
router.get('/all', getAllQuestions);  

export default router;
