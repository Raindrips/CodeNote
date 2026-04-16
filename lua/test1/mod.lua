-- 可以给其他文件调用 

function PlanA()
  return 'hello'
end

local count=0 --local局部变量不会被外部访问

function PlanB()
  count=count+1
  return count
end
