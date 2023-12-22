const Todo = require('../models/todo.model');

const createTodo = async (req,res) => {
    try {
        const {title, description,dueDate} = req.body;
        if(!title || !description || !dueDate) {
            return res.status(400).json({success:false, message:"All fields are required to create an todo",data:null}); 
        }

        const user = req.user;
        if(!user || !user._id){
            return res.status(401).json({success: false, message:"User not authenticated to create an todo", data:null});
        }

        const newTodo = await Todo.create({
            title, 
            description,
            dueDate,
            user:user?._id
        });
        const savedTodo = await newTodo.save();
        return res.status(200).json({success: true, message:"Todo created successfully", data:savedTodo});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error creating todo", data:null});
    }
}

const getTodo = async (req,res) => {
    try {
        const { todoId } = req.params;
        if(!todoId){
            return res.status(401).json({success: false, message:"Invalid Todo Id", data:null});
        }
        const todo = await Todo.findById(todoId);
        return res.status(200).json({success: true, message:"Todo fetched successfully", data:todo});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error fetching todo", data:null});
    }
}

const updateTodo = async (req,res) => {
    try {
        const { todoId } = req.params;
        if(!todoId){
            return res.status(401).json({success: false, message:"Invalid Todo Id", data:null});
        }
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, req.body, { new: true });
        if(!updatedTodo){
            return res.status(401).json({success: false, message:"Invalid Todo Id", data:null});
        }
        return res.status(200).json({success: true, message:"Todo updated successfully", data:updatedTodo});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error updating todo", data:null});
    }
}

const deleteTodo = async (req,res) => {
    try {
        const { todoId } = req.params;
        if(!todoId){
            return res.status(401).json({success: false, message:"Invalid Todo Id", data:null});
        }
        const deletedTodo = await Todo.findByIdAndDelete(todoId);
        if(!deletedTodo) {
            return res.status(401).json({success: false, message:"Invalid Todo ID", data:null});
        }
        return res.status(200).json({success: true, message:"Todo deleted successfully", data:null});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error deleting todo", data:null});
    }
}

const getAllTodosByUserId = async (req,res) => {
    try {
        const user = req.user;
        if(!user || !user._id){
            return res.status(401).json({success: false, message:"User not found", data:null});
        }

        const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc', completed } = req.query;
        const query = { //creating an query object based on parameters
            user: user?._id
        };
        if (completed !== undefined) {
            query.isCompleted = completed === 'true';
        }

        const userTodos = await Todo
        .find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize, 10));

        return res.status(200).json({success: true, message:"User Todo fetched successfully", data:userTodos});

    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:"Error fetching user todos", data:null});
    }
}


module.exports = {
    createTodo,
    getTodo,
    updateTodo,
    deleteTodo,
    getAllTodosByUserId
}