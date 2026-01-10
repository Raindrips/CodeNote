/**
 * JWT认证中间件
 * 用于验证用户身份和权限
 */
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { unauthorized, error } = require('../utils/response');

/**
 * JWT认证中间件
 * 验证请求头中的Token是否有效
 */
function authenticateToken(req, res, next) {
  try {
    // 从请求头中提取Token
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json(unauthorized('缺少访问Token'));
    }

    // 验证Token有效性
    const decoded = verifyToken(token);
    
    // 将用户信息附加到请求对象
    req.user = {
      id: decoded.id,
      username: decoded.username
    };
    
    next();
  } catch (error) {
    if (error.message === 'Token已过期') {
      return res.status(401).json(unauthorized('Token已过期，请重新登录'));
    } else if (error.message === 'Token无效') {
      return res.status(401).json(unauthorized('Token无效'));
    } else {
      return res.status(401).json(unauthorized('Token验证失败'));
    }
  }
}

/**
 * 可选认证中间件
 * 如果提供了Token则验证，不提供也不阻止访问
 */
function optionalAuthenticateToken(req, res, next) {
  try {
    const token = extractTokenFromHeader(req);
    
    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        username: decoded.username
      };
    }
    
    next();
  } catch (error) {
    // Token验证失败也不阻止访问，只是不设置req.user
    next();
  }
}

module.exports = {
  authenticateToken,
  optionalAuthenticateToken
};
