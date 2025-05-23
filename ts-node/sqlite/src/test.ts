import { Database } from './database';

/**
 * SQLite3 Node.js 官方文档：

GitHub: https://github.com/TryGhost/node-sqlite3
API文档: https://github.com/TryGhost/node-sqlite3/wiki/API

SQLite 官方文档：

官网: https://www.sqlite.org/
SQL语法: https://www.sqlite.org/lang.html
函数参考: https://www.sqlite.org/lang_corefunc.html

NPM 包文档：

npm 页面: https://www.npmjs.com/package/sqlite3
 */

async function main() {
    const db = new Database();

    try {
        // 创建表
        await db.createTable();

        // 插入数据
        const userId = await db.insert('张三', 'zhangsan@example.com', 30);
        console.log('插入用户，ID:', userId);

        // 查询所有用户
        const users = await db.findAll();
        console.log('所有用户:', users);

        // 根据ID查询用户
        const user = await db.findById(userId);
        console.log('查询的用户:', user);

        // 更新用户
        await db.update(userId, '张三updated', 'updated@example.com', 31);
        const updatedUser = await db.findById(userId);
        console.log('更新后的用户:', updatedUser);

        // 删除用户
        await db.delete(userId);
        console.log('用户已删除');
    } catch (error) {
        console.error('操作失败:', error);
    } finally {
        await db.close();
    }
}

main();
