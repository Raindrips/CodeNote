/**
 * 统一响应格式工具类
 * 所有接口返回数据统一使用此格式
 */

/**
 * 成功响应
 * @param {Object} data - 响应数据
 * @param {string} message - 成功消息
 * @returns {Object} 标准化响应对象
 */
function success(data = null, message = '操作成功') {
  return {
    code: 200,
    msg: message,
    data: data
  };
}

/**
 * 错误响应
 * @param {string} message - 错误消息
 * @param {number} code - 错误代码
 * @param {Object} data - 额外错误数据
 * @returns {Object} 标准化错误响应对象
 */
function error(message = '操作失败', code = 500, data = null) {
  return {
    code: code,
    msg: message,
    data: data
  };
}

/**
 * 参数错误响应
 * @param {string} message - 错误消息
 * @returns {Object} 参数错误响应对象
 */
function validateError(message = '参数错误') {
  return {
    code: 400,
    msg: message,
    data: null
  };
}

/**
 * 未授权响应
 * @param {string} message - 错误消息
 * @returns {Object} 未授权响应对象
 */
function unauthorized(message = '未授权访问') {
  return {
    code: 401,
    msg: message,
    data: null
  };
}

module.exports = {
  success,
  error,
  validateError,
  unauthorized
};
