function test1()
    local tb = {key = 10}
    local tb2 = {key = 20}
    local add = {
        __add = function(my, other)
            my.key = my.key + other.key
            return my
        end
    }

    local newtb = setmetatable(tb, add)
    newtb = newtb + tb2;

    for key, value in pairs(newtb) do print(key, value, newtb) end
end

function CallTest()
    local tb1 = {key = 10}
    local newtb = setmetatable(tb1, {__call = function(my,other) 
      print(other)
    end})
    newtb('hello world')
end

-- test1()
CallTest()
