/**
 * 参数校验中间件
 * 使用express-validator进行参数验证
 */
const { body, validationResult } = require('express-validator');
const { validateError } = require('../utils/response');

/**
 * 处理验证错误
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return res.status(400).json(validateError(errorMessages));
  }
  next();
}

/**
 * 用户注册参数校验规则
 */
const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6, max: 50 }).withMessage('密码长度必须在6-50个字符之间')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/).withMessage('密码必须包含大小写字母和数字'),
  handleValidationErrors
];

/**
 * 用户登录参数校验规则
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间'),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6, max: 50 }).withMessage('密码长度必须在6-50个字符之间'),
  handleValidationErrors
];

/**
 * 修改密码参数校验规则
 */
const validateChangePassword = [
  body('oldPassword')
    .notEmpty().withMessage('旧密码不能为空'),
  body('newPassword')
    .notEmpty().withMessage('新密码不能为空')
    .isLength({ min: 6, max: 50 }).withMessage('新密码长度必须在6-50个字符之间')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/).withMessage('新密码必须包含大小写字母和数字'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
  handleValidationErrors
};
