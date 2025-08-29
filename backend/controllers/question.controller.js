import { User } from '../models/user.model.js';
import Question from '../models/question.model.js';

// Add a New Question
const addQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "Question field must be filled." });
        }

        // Find user details since we have userId from token
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newQuestion = new Question({
            name: user.name,
            email: user.email,
            question,
            userId: req.userId
        });

        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Questions by Logged-in User
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find({ userId: req.userId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Questions (Admin View)
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('userId', 'name email');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Specific Question by ID
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Question
const updateQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const questionToUpdate = await Question.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!questionToUpdate) {
            return res.status(404).json({ message: 'Question not found or unauthorized' });
        }

        questionToUpdate.question = question;
        await questionToUpdate.save();

        res.status(200).json(questionToUpdate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Question
const deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found or unauthorized' });
        }
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    addQuestion,
    getQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};
