/**
 * JWT工具类
 * 用于生成和验证JSON Web Token
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * 生成JWT Token
 * @param {Object} payload - Token载荷数据
 * @returns {string} 生成的Token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'nodejs-login-system'
  });
}

/**
 * 验证JWT Token
 * @param {string} token - 需要验证的Token
 * @returns {Object} 解码后的Token数据
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token已过期');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token无效');
    } else {
      throw new Error('Token验证失败');
    }
  }
}

/**
 * 从请求头中提取Token
 * @param {Object} req - Express请求对象
 * @returns {string|null} 提取的Token或null
 */
function extractTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  
  // 支持 "Bearer token" 格式
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  // 支持直接token格式
  return authHeader;
}

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
