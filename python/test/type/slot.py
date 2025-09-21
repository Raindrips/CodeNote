
'''
## 修改继承实例对象,将元组中的非整数元素过滤掉
'''
class IntTuple(tuple):

    # 先new
    def __new__(cls, iterable):
        print('new')
        g=(x for x in iterable if isinstance(x,int) and x>=0)
        return super().__new__(cls, g)
    
    # 后init
    def __init__(self, iterable):
        print('init')
        # for i in iterable:
        #     if not isinstance(i, int):
        #         raise TypeError('tuple element must be int')
   

'''
## 创建大量实例减少内存

在类中定义 __slot属性可以减少内存占用
__slots__ 定义的属性仅对当前类实例起作用，对继承的子类是不起作用的
如果想让 __slots__ 生效，需要在子类中也定义 __slots__，
'''

class Example_slot:
    __slots__ = ['name', 'id']
    def __init__(self, name, id):
        self.name = name
        self.id = id
        
if __name__ == '__main__':
    e = Example_slot('a', 1)
    print(e.name)
    print(e.id)
    # e.age = 10  # 报错
    print(e.__slots__)
    
    t = IntTuple([1, 2, 3, 4, 5, 6,3.14,"hello world"])
    print(t)