(() => {
    // Record 替代 {[key:string]:number} 类型
    let obj: Record<string, number> = {};
    obj.a = 10;
    obj.b = 20;
    console.log(obj);

    //创建泛型类型
    function createDict<T>(): Record<string, T> {
        return {};
    }
    function createTypedDict<
        K extends string | number | symbol,
        V,
    >(): Record<K, V> {
        return {} as Record<K, V>;
    }
    const dict1 = createDict<number>();
    const dict2 = createTypedDict<number, string>();
})();
