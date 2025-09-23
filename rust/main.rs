fn main(){
    //输出
    println!("hello world");
    let a=10;
    //a=20;
    println!("{}",a);
    //定义可变变量,可以被修改的变量
    let mut x = 5;
    println!("{}",x);
    x=10;
    println!("{}",x);

    let tup:(i32,i64,char)=(123,123456i64,'c');
    println!("{} {} {}",tup.0,tup.1,tup.2);
    let arr=[1,2,3,4,5,6];
    for v in arr.iter() {
        print!("{} ",v);
    }
    println!();
    
}