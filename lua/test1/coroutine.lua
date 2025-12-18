
-- coroutine.create     创建协程

-- coroutine.yield      协程挂起
-- coroutine.resume     恢复挂起
-- coroutine.status     获取状态


local co = coroutine.create(function()
    print("step 1")
    coroutine.yield()
    print("step 2")
end)

coroutine.resume(co) -- step 1
print(coroutine.status(co)) --suspended
coroutine.resume(co) -- step 2
print(coroutine.status(co)) --dead