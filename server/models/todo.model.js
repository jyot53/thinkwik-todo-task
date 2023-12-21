const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        dueDate:{
            type: Date,
            required: [true, 'Due date is required'],
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;