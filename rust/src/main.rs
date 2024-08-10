#![allow(dead_code)]

use std::mem;
enum Direction {
    Up = 0,
    Down,
    Left,
    Right,
}

fn test1() {
    let t = (10i32, 3.14f32, 1.234567, 'a');

    let tuple = (1, "hello", 4.5, true);

    let (a, b, c, d) = tuple;

    println!("{:}", t.0);
    println!("{:}", t.3);

    println!("{:?}", t);

    println!("{:?}", tuple);
    println!("{:?}, {:?}, {:?}, {:?}", a, b, c, d);
}

fn test2() {
    let d = Direction::Down;
    match d {
        Direction::Down => println!("Down"),
        Direction::Up => println!("Up"),
        Direction::Left => println!("Left"),
        Direction::Right => println!("Right"),
    }

    let d = Direction::Left;
    d.out();
}

impl Direction {
    fn out(&self) {
        match self {
            Direction::Down => println!("Down"),
            Direction::Up => println!("Up"),
            Direction::Left => println!("Left"),
            Direction::Right => println!("Right"),
        }
    }
}

fn test3() {
    let x = [0, 1, 2, 3, 4];
    let x2: [i32; 5];

    let mut x3: [i32; 100] = [1; 100];

    let mut br_x = x3;
    x3[1] = 10;

    let mut bx = &x3[1..5];
    // x3[2]=20;

    println!("{:?}", x);
    // println!("{:?}", x2);
    println!("{:?}", bx);

    println!("len={}", x3.len());

    // 数组是在栈中分配的
    println!("array occupies {} bytes", mem::size_of_val(&x3));
}

#[derive(Debug)]
struct Person {
    id: i32,
    name: String,
}

// 单元结构体
struct Unit;

#[derive(Debug)]
struct Vec3(f32, f32, f32);

fn test4() {
    //初始化结构体
    let p=Person{id:1,name:String::from("peter")};

    let id=2;
    let name=String::from("bob");
    // 属性名相同,可以直接填入
    let p2=Person{id,name};
    // 元组结构体
    let v3=Vec3(1.0,2.0,3.0);

    // 结构体加上#[derive(Debug)] 才能进行输出
    println!("{:?}\n {:?}\n {:?}\n",p,p2,v3);
}

fn main() {
    // test1();
    // test2();
    // test3();
    test4();
}
