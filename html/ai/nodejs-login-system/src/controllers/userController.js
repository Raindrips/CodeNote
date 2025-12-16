/**
 * 用户控制器
 * 处理用户相关的HTTP请求
 */
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');

class UserController {
  /**
   * 用户注册
   * POST /api/user/register
   */
  static async register(req, res) {
    try {
      const { username, password } = req.body;

      // 检查用户名是否已存在
      const isExists = await User.isUsernameExists(username);
      if (isExists) {
        return res.status(409).json(error('用户名已存在', 409));
      }

      // 创建新用户
      const newUser = await User.create({ username, password });

      // 生成JWT Token
      const token = generateToken({
        id: newUser.id,
        username: newUser.username
      });

      // 返回注册成功信息
      const responseData = {
        user: {
          id: newUser.id,
          username: newUser.username,
          created_at: newUser.created_at
        },
        token: token
      };

      return res.status(201).json(success(responseData, '用户注册成功'));
    } catch (err) {
      console.error('用户注册失败:', err);
      return res.status(500).json(error('用户注册失败，请稍后重试'));
    }
  }

  /**
   * 用户登录
   * POST /api/user/login
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // 查找用户
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json(error('用户名或密码错误', 401));
      }

      // 验证密码
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json(error('用户名或密码错误', 401));
      }

      // 生成JWT Token
      const token = generateToken({
        id: user.id,
        username: user.username
      });

      // 返回登录成功信息
      const responseData = {
        user: {
          id: user.id,
          username: user.username
        },
        token: token
      };

      return res.json(success(responseData, '登录成功'));
    } catch (err) {
      console.error('用户登录失败:', err);
      return res.status(500).json(error('登录失败，请稍后重试'));
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/user/info
   */
  static async getUserInfo(req, res) {
    try {
      const userId = req.user.id;

      // 查找用户信息
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(error('用户不存在', 404));
      }

      // 返回用户信息（不包含密码）
      const userInfo = {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
        updated_at: user.updated_at
      };

      return res.json(success(userInfo, '获取用户信息成功'));
    } catch (err) {
      console.error('获取用户信息失败:', err);
      return res.status(500).json(error('获取用户信息失败'));
    }
  }

  /**
   * 修改密码
   * PUT /api/user/change-password
   */
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      // 查找用户
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(error('用户不存在', 404));
      }

      // 验证旧密码
      const isPasswordValid = await User.verifyPassword(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json(error('旧密码错误', 401));
      }

      // 更新密码
      const isUpdated = await User.updatePassword(userId, newPassword);
      if (!isUpdated) {
        return res.status(500).json(error('密码修改失败'));
      }

      return res.json(success(null, '密码修改成功'));
    } catch (err) {
      console.error('修改密码失败:', err);
      return res.status(500).json(error('密码修改失败'));
    }
  }

  /**
   * 获取所有用户列表（管理员功能）
   * GET /api/user/list
   */
  static async getUserList(req, res) {
    try {
      const users = await User.getAllUsers();
      return res.json(success(users, '获取用户列表成功'));
    } catch (err) {
      console.error('获取用户列表失败:', err);
      return res.status(500).json(error('获取用户列表失败'));
    }
  }

  /**
   * 删除用户（管理员功能）
   * DELETE /api/user/:id
   */
  static async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json(error('用户ID格式错误', 400));
      }

      // 不能删除自己
      if (userId === req.user.id) {
        return res.status(403).json(error('不能删除自己的账户', 403));
      }

      const isDeleted = await User.deleteUser(userId);
      if (!isDeleted) {
        return res.status(404).json(error('用户不存在', 404));
      }

      return res.json(success(null, '用户删除成功'));
    } catch (err) {
      console.error('删除用户失败:', err);
      return res.status(500).json(error('删除用户失败'));
    }
  }
}

module.exports = UserController;
