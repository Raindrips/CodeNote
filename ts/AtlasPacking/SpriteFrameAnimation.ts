import { _decorator, Component, Node, Sprite, SpriteAtlas, SpriteFrame, UITransform } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

enum SpriteFrameAnimationState {
    none,
    playing,
}

@ccclass('SpriteFrameAnimation')
@requireComponent(Sprite)
export class SpriteFrameAnimation extends Component {

    private spriteFrames: SpriteFrame[] = []

    private index: number = 0

    private state: SpriteFrameAnimationState = SpriteFrameAnimationState.none

    private setState(state: SpriteFrameAnimationState) {
        this.state = state
    }

    protected onLoad(): void {
        const spriteAtlas: SpriteAtlas = this.node.getComponent(Sprite)!.spriteAtlas!;
        if (!spriteAtlas) {
            console.log(`${this.node.name} 没有 SpriteAtlas 资源`)
        }
        this.spriteFrames = getSpriteFrames(spriteAtlas)
        this.spriteFrames.push(null!);
    }

    /**
     * 播放动画
     */
    public play() {
        if (this.spriteFrames.length == 0) {
            console.log(`${this.node.name} 没有 SpriteFrame 资源`)
            return
        }
        this.reset();
        this.setState(SpriteFrameAnimationState.playing)
    }

    update(dt: number): void {
        if (this.state == SpriteFrameAnimationState.playing) {
            console.log(this.index, dt)
            this.index++;
            let frame = Math.floor(this.index / 2)


            if (frame >= this.spriteFrames.length) {
                this.setState(SpriteFrameAnimationState.none)
            } else if(this.index % 2 == 0){

                this.node.getComponent(Sprite)!.spriteFrame = this.spriteFrames[frame]
                if(!this.spriteFrames[frame]){
                    return
                }
                const size = this.spriteFrames[frame]?.originalSize
                this.node.getComponent(UITransform)!.width = size.width
                this.node.getComponent(UITransform)!.height = size.height

                
            }
            
        }

    }

    private reset() {
        this.index = 0
        this.node.getComponent(Sprite)!.spriteFrame = null;

    }

}

/**
 * 获取 SpriteAtlas 中的 SpriteFrame 资源
 * 并将 SpriteFrame 资源按名称排序到数组中
 * @param spriteAtlas 
 * @returns 
 */
function getSpriteFrames(spriteAtlas: SpriteAtlas): SpriteFrame[] {
    const spriteFrameMap = spriteAtlas!.spriteFrames
    let keyList: string[] = []
    let spriteFrames: SpriteFrame[] = []
    for (let key in spriteFrameMap) {
        keyList.push(key)
    }
    keyList.sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true })
    })
    for (let key of keyList) {

        spriteFrames.push(spriteFrameMap[key]!)
    }
    return spriteFrames
}


