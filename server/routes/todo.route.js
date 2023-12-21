const router = require('express').Router();
const {
    createTodo,
    getTodo,
    updateTodo,
    deleteTodo,
    getAllTodosByUserId
} = require('../controllers/todo.controller');

router.route('/').post(createTodo);
router.route('/').get(getAllTodosByUserId);
router.route('/:todoId').get(getTodo);
router.route('/:todoId').put(updateTodo);
router.route('/:todoId').delete(deleteTodo);

module.exports = router;