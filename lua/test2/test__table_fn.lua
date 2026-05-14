
local Tab={

    fn2=function (self)
        return self
    end
}
 function Tab:func()
    self.a=10
    self.b='Tab'
    return self;
end

for key, value in pairs(Tab:fn2()) do
    print(key,value);
end
