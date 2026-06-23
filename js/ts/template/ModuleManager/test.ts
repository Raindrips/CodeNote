import { ModuleManager } from './ModuleManager';

class Player {
    constructor(
        public id = 10,
        public name = 'hello world',
    ) {}

    print() {
        console.log(`${this.id} ${this.name}`);
    }
}

// 注册对象
ModuleManager.register('Player', new Player());

//获取类型
const id = ModuleManager.get<number>('Player.id');
console.log('get id: ' + id);


//调用方法
ModuleManager.call<void>('Player.print');

// 获取对象
const player=ModuleManager.getModule<Player>('Player');
console.log(player);

// try error
ModuleManager.call<void>('Player.abcd');
ModuleManager.get<void>('get.abcd');

