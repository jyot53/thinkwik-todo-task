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
        await Todo.findByIdAndDelete(todoId);
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

        const userTodos = await Todo.find({
            // $where: function() {
            //     return this.user === user?._id;
            // }
            user: user?._id
        });

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