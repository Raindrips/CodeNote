local tab={}

table.insert(tab,10)
table.insert(tab,20)
table.insert(tab,30)

for i = 1, #tab do
    print(tab[i])
end

for key, value in pairs(tab) do
    print(key,value)
end