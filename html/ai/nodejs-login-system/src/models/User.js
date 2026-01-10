/**
 * 用户模型
 * 处理用户相关的数据库操作
 */
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

class User {
  /**
   * 根据用户名查找用户
   * @param {string} username - 用户名
   * @returns {Object|null} 用户对象或null
   */
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, password, created_at, updated_at FROM users WHERE username = ?',
        [username]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('查找用户失败:', error);
      throw new Error('数据库查询失败');
    }
  }

  /**
   * 根据用户ID查找用户
   * @param {number} id - 用户ID
   * @returns {Object|null} 用户对象或null
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('查找用户失败:', error);
      throw new Error('数据库查询失败');
    }
  }

  /**
   * 检查用户名是否已存在
   * @param {string} username - 用户名
   * @returns {boolean} 是否存在
   */
  static async isUsernameExists(username) {
    try {
      const user = await this.findByUsername(username);
      return user !== null;
    } catch (error) {
      console.error('检查用户名失败:', error);
      throw new Error('数据库查询失败');
    }
  }

  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   * @returns {Object} 创建的用户对象
   */
  static async create(userData) {
    const { username, password } = userData;
    
    try {
      // 密码加密
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 插入用户数据
      const [result] = await pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );

      // 返回创建的用户信息
      return {
        id: result.insertId,
        username: username,
        created_at: new Date(),
        updated_at: new Date()
      };
    } catch (error) {
      console.error('创建用户失败:', error);
      throw new Error('用户创建失败');
    }
  }

  /**
   * 验证用户密码
   * @param {string} plainPassword - 明文密码
   * @param {string} hashedPassword - 加密后的密码
   * @returns {boolean} 是否匹配
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('密码验证失败:', error);
      throw new Error('密码验证失败');
    }
  }

  /**
   * 更新用户密码
   * @param {number} userId - 用户ID
   * @param {string} newPassword - 新密码
   * @returns {boolean} 是否成功
   */
  static async updatePassword(userId, newPassword) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      const [result] = await pool.execute(
        'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
        [hashedPassword, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新密码失败:', error);
      throw new Error('密码更新失败');
    }
  }

  /**
   * 获取所有用户列表（不包含密码）
   * @returns {Array} 用户列表
   */
  static async getAllUsers() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, created_at, updated_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw new Error('获取用户列表失败');
    }
  }

  /**
   * 删除用户
   * @param {number} userId - 用户ID
   * @returns {boolean} 是否成功
   */
  static async deleteUser(userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw new Error('用户删除失败');
    }
  }
}

module.exports = User;
