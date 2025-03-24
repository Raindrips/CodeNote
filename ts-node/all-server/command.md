## 启动服务器

修改 index.ts 时，服务器都会自动重启

```
npm start
```

## 请求

```
curl http://localhost:3000
curl -X POST http://localhost:3000
```

## 请求带码

```javascript
// GET: 获取所有用户
fetch('http://localhost:3000/users')
    .then((response) => response.json())
    .then((data) => console.log('All users:', data))
    .catch((error) => console.error('Error:', error));

// GET: 按 name 过滤用户（例如查找包含 "alice" 的用户）
fetch('http://localhost:3000/users?name=alice')
    .then((response) => response.json())
    .then((data) => console.log('Filtered users:', data))
    .catch((error) => console.error('Error:', error));

// POST: 添加新用户
fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Charlie',
        email: 'charlie@example.com',
    }),
})
    .then((response) => response.json())
    .then((data) => console.log('Added user:', data))
    .catch((error) => console.error('Error:', error));

// PUT: 更新用户邮箱（例如更新 ID 为 1 的用户）
fetch('http://localhost:3000/users/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'newalice@example.com' }),
})
    .then((response) => response.json())
    .then((data) => console.log('Updated user:', data))
    .catch((error) => console.error('Error:', error));

// DELETE: 删除用户（例如删除 ID 为 2 的用户）
fetch('http://localhost:3000/users/2', {
    method: 'DELETE',
})
    .then(() => console.log('User deleted'))
    .catch((error) => console.error('Error:', error));
```

```
# GET
curl "http://localhost:3000/users?name=alice"

# POST
curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Charlie", "email": "charlie@example.com"}'

# PUT
curl -X PUT http://localhost:3000/users/1 \
     -H "Content-Type: application/json" \
     -d '{"email": "newalice@example.com"}'

# DELETE
curl -X DELETE http://localhost:3000/users/2

```

说明：

-   X PUT 指定请求方法为 PUT。
-   URL 中的 /1 表示更新 ID 为 1 的用户。
-   d 参数传递 JSON 数据，包含新的 email。
