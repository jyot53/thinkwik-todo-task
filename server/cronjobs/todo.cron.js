const cron = require('node-cron');
const Todo = require('../models/todo.model');

// CRON job to run every day at midnight (0 0 * * *)
const task = cron.schedule('0 0 * * *', async () => {
  console.log('Running the daily CRON job...');
  try {
    // Find incomplete todos with a due date in the past
    const expiredTodos = await Todo.find({
      dueDate: { $lt: new Date() },
      isCompleted: false,
    });

    // Update expired todos to mark them as completed
    await Promise.all(expiredTodos.map(todo => {
      todo.isCompleted = true;
      return todo.save();
    }));

    console.log('CRON job completed successfully. Marked as expired todos as completed');
  } catch (error) {
    console.error('Error running CRON job:', error);
  }
});

module.exports = task;
