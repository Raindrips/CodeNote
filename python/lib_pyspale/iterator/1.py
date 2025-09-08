l = [1, 2, 3, 4]

a = iter(l)
print(a)


def function():

    print("1:")
    yield 1

    print("2:")
    yield 2

    print("3:")
    yield 3
    print("end")
    yield 4


g = function()
for i in g:
    print(i)
