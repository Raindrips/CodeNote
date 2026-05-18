local b=0 --定义局部变量
local function fn1()
    A=10 --a为全局变量
    b=20;
end
fn1();
print(A,b)
print(_ENV.A)