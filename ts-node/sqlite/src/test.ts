import { Database } from './database';

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