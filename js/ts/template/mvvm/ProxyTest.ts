import { VM } from './VMManager';

(() => {
    const globalData = {
        pos: { x: 10, y: 20 },
        item: [1, 2, 3, 4, 5],
        score: 0,
    };

    VM.add(globalData, 'player', (data) => {
        console.log(data);
        if (data.path == 'score') {
            console.log('修改分数');
        }
        if (data.path == 'item') {
            console.log('修改物品');
        }
        if (data.path.startsWith('pos')) {
            console.log('移动位置');
        }
    });
    const vmData:any = VM.get('player')?.$data; //有效
    // const vmData = globalData; //无效
    if (vmData) {
        vmData.item.push(10);
        vmData.score = 100;
        vmData.pos.y += 50;
    }

    console.log(globalData);
})();
