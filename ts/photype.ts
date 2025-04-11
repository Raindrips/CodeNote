{
    function get<T>(type: { prototype: T }) {
        return type;
    }

    function getTypeName<T>(value: T): string {
        if (value === null) {
          return "null";
        }
        if (typeof value === 'object') {
          // 对于对象，尝试获取其构造函数名称
          if (value.constructor && value.constructor.name) {
            return value.constructor.name;
          } else {
            return "object"; // 无法获取到具体的构造函数名称
          }
        }
        return typeof value;
      }
      

    class ABC {
        id: number = 0;
        name: string = 'hello';
    }

    function main() {
        console.log(get(ABC), get(Number), get(Date));
        console.log(getTypeName(new ABC()), getTypeName(123), getTypeName(new Date));
    }

    main();
}
