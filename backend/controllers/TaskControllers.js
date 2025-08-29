import Task from "../models/TaskModel.js";
import Employee from "../models/EmployeeModel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'senara.nilmani2002@gmail.com', // Your Gmail address
        pass: 'sswh epcn npcq kkbv'  // Your Gmail app password
    }
});

const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate('employee', 'name')
            .lean();

        tasks.forEach(task => {
            delete task.id;
        });

        return res.status(200).json({ tasks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const addTasks = async (req, res, next) => {
    const { taskName, taskDescription, deadline, status, id } = req.body;

    if (!taskName || !taskDescription || !deadline || !status || !id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const validateStatus = ["Pending", "In Progress", "Completed"];
    if (!validateStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status. Allowed values: Pending, In Progress, Completed" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const employee = await Employee.findById(id).session(session);
        if (!employee) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Employee not found" });
        }

        const task = new Task({
            employee: employee._id,
            taskName,
            taskDescription,
            deadline,
            status,
        });

        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        const populatedTask = await Task.findById(task._id).populate('employee', 'name');

        return res.status(201).json({ task: populatedTask });
    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const getById = async (req, res) => {
    const tid = req.params.id;

    try {
        const task = await Task.findById(tid).populate('employee', 'name email');

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Ensure employee data is properly populated
        if (task.employee && !task.employee.email) {
            const employee = await Employee.findById(task.employee._id);
            if (employee) {
                task.employee = employee;
            }
        }

        return res.status(200).json({ task });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const updateTask = async (req, res, next) => {
    const { taskName, taskDescription, deadline, status } = req.body;
    const { id } = req.params;

    const validateStatus = ["Pending", "In Progress", "Completed"];
    if (status && !validateStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status. Allowed values: Pending, In Progress, Completed" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.findById(id).session(session);
        if (!task) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Task not found" });
        }

        if (taskName) task.taskName = taskName;
        if (taskDescription) task.taskDescription = taskDescription;
        if (deadline) task.deadline = deadline;
        if (status) task.status = status;

        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        const populatedTask = await Task.findById(task._id).populate('employee', 'name');

        return res.status(200).json({ task: populatedTask });
    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const deleteTask = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the task first to check if it exists
        const task = await Task.findById(id).populate('employee', 'name email');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // If there's an employee assigned, send email notification
        if (task.employee && task.employee.email) {
            try {
                const mailOptions = {
                    from: 'malshanmaduwantha2001@gmail.com',
                    to: task.employee.email,
                    subject: 'Task Cancellation Notification',
                    html: `
                        <h2>Task Cancellation Notification</h2>
                        <p>Dear ${task.employee.name},</p>
                        <p>This email is to inform you that the following task has been cancelled:</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <p><strong>Task Name:</strong> ${task.taskName}</p>
                            <p><strong>Description:</strong> ${task.taskDescription}</p>
                            <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> ${task.status}</p>
                            <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                        <p>If you have any questions, please contact your supervisor.</p>
                        <p>Best regards,<br>Malshan Motors</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log('Cancellation email sent successfully');
            } catch (emailError) {
                console.error('Error sending cancellation email:', emailError);
                // Continue with deletion even if email fails
            }
        }

        // Delete the task
        await Task.findByIdAndDelete(id);

        return res.status(200).json({ 
            message: "Task deleted successfully",
            emailSent: task.employee && task.employee.email ? true : false,
            employee: task.employee ? {
                name: task.employee.name,
                email: task.employee.email
            } : null
        });
    } catch (err) {
        console.error("Error in deleteTask:", err);
        return res.status(500).json({ 
            message: "Failed to delete task", 
            error: err.message 
        });
    }
};

export {
    getAllTasks,
    addTasks,
    getById,
    updateTask,
    deleteTask
};