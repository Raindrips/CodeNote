import sqlite3 from 'sqlite3';

// 数据库连接类
export class Database {
    private db: sqlite3.Database;

    constructor(dbPath: string = './dist/mydb.sqlite') {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('数据库连接失败:', err.message);
            } else {
                console.log('成功连接到数据库');
            }
        });
    }

    // 创建表
    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER
      )
    `;

        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // 插入数据
    insert(username: string, email: string, age: number) {
        const sql =
            'INSERT INTO users (username, email, age) VALUES (?, ?, ?)';

        return new Promise<number>((resolve, reject) => {
            this.db.run(sql, [username, email, age], function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    // 查询所有用户
    findAll() {
        const sql = 'SELECT * FROM users';

        return new Promise<any[]>((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // 根据ID查询用户
    findById(id: number) {
        const sql = 'SELECT * FROM users WHERE id = ?';

        return new Promise<any>((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // 更新用户
    update(id: number, username: string, email: string, age: number) {
        const sql =
            'UPDATE users SET username = ?, email = ?, age = ? WHERE id = ?';

        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, [username, email, age, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // 删除用户
    delete(id: number) {
        const sql = 'DELETE FROM users WHERE id = ?';

        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, [id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // 关闭数据库连接
    close() {
        return new Promise<void>((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}
