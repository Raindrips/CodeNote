/**
 * 用户路由定义
 * 定义所有用户相关的API路由
 */
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegister, validateLogin, validateChangePassword } = require('../middleware/validation');

/**
 * @route   POST /api/user/register
 * @desc    用户注册
 * @access  Public
 * @body    {username, password}
 */
router.post('/register', validateRegister, UserController.register);

/**
 * @route   POST /api/user/login
 * @desc    用户登录
 * @access  Public
 * @body    {username, password}
 */
router.post('/login', validateLogin, UserController.login);

/**
 * @route   GET /api/user/info
 * @desc    获取当前用户信息
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/info', authenticateToken, UserController.getUserInfo);

/**
 * @route   PUT /api/user/change-password
 * @desc    修改密码
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    {oldPassword, newPassword}
 */
router.put('/change-password', authenticateToken, validateChangePassword, UserController.changePassword);

/**
 * @route   GET /api/user/list
 * @desc    获取所有用户列表（管理员功能）
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/list', authenticateToken, UserController.getUserList);

/**
 * @route   DELETE /api/user/:id
 * @desc    删除用户（管理员功能）
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @param   {number} id - 用户ID
 */
router.delete('/:id', authenticateToken, UserController.deleteUser);

module.exports = router;
