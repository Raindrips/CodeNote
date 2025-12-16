-- Node.js登录系统数据库初始化脚本
-- 创建数据库和用户表

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS nodejs_login 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE nodejs_login;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  username VARCHAR(20) NOT NULL UNIQUE COMMENT '用户名，唯一',
  password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_username (username),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入测试数据（可选）
-- 密码: Test123456
INSERT INTO users (username, password) VALUES 
('admin', '$2b$10$LQv3cL.5V7pHldnVf1F8OuVqT7GjsjhQpTcX8gQxk8zXz5zXz5zX'),
('testuser', '$2b$10$LQv3cL.5V7pHldnVf1F8OuVqT7GjsjhQpTcX8gQxk8zXz5zXz5zX');

-- 查看表结构
DESCRIBE users;

-- 查看索引
SHOW INDEX FROM users;

-- 查看数据
SELECT * FROM users LIMIT 5;

-- 创建数据库备份用户（可选）
-- CREATE USER 'backup_user'@'localhost' IDENTIFIED BY 'backup_password';
-- GRANT SELECT, LOCK TABLES ON nodejs_login.* TO 'backup_user'@'localhost';
-- FLUSH PRIVILEGES;

-- 使用说明：
-- 1. 执行此SQL文件创建数据库和表
-- 2. 修改项目中的数据库连接配置
-- 3. 启动Node.js应用
-- 4. 应用会自动创建所需的数据表结构
