import sqlite3 from 'sqlite3';

class SqlExecute {
    private db: sqlite3.Database;
    constructor(dbPath: string) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('数据库连接失败:', err.message);
            } else {
                console.log('成功连接到数据库');
            }
        });
    }

    getDB() {
        return this.db;
    }

    // 执行不返回数据的 SQL
    run(sql: string) {
        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
    // 获取所有行数据
    all(sql: string) {
        return new Promise<any[]>((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

async function test() {
    const db = new SqlExecute('./db.sqlite');
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL
      )
        `;
    console.log('创建数据库...');
    await db.run(sql);
    console.log('插入表格...');
    await db.run(`INSERT INTO users (id,username) VALUES (0,'A1')`);
    await db.run(`INSERT INTO users (id,username) VALUES (1,'B2')`);
    await db.run(`INSERT INTO users (id,username) VALUES (2,'C3')`);

    console.log('查询');
    const value = await db.all('select * from users');
    console.log(value);
}

async function test2() {
    const db = new SqlExecute('./dist/db.sqlite');
    const value = await db.all('select * from users');
    console.log(value);
}

test();
