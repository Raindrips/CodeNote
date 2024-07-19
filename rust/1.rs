struct Node<T>{
    data:T,
    next:Option<Box<Node<T>>>,
}

// 
pub struct LinkedList<T> {
    head: Option<Box<Node<T>>>,
}

impl<T> LinkedList<T>{
    fn new()->Self{
        return LinkedList{head:None}
    }

    fn append(&mut self,value:T){
        let new_node=Box::new(Node{
            data:value,
            next:None,
        });
        
    }
}

fn main(){
    print!("OK ");
    println!("hello world");
    let a=Box::new(10);
    println!("{} {}",a,*a);
    
}