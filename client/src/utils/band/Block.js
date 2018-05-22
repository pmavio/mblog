import states from './states';

/**
 * 块
 */
export default class Block{

    static fromBlock(blockJson){
        let block = new Block(blockJson.visible);
        return block;
    }

    /**
     *
     * @param visible 显示状态
     */
    constructor(visible=false){
        this.visible = visible;
    }

//unswap 表链 正 正->背(下)
//unswap 背链 背 背->正(上)
//swaped 表链 正 正->背(刮)
//swaped 背链 背 背->正(搭)

    /**
     * 根据swap，side和自身visible值，返回操作值
     * @param swap
     * @param side
     * @returns {*}
     */
    getOperation(swap, side){
        if(swap === states.swap.unswap){
            if(side === states.side.face){
                return !this.visible?states.operation.下:states.operation.不下;
            }else {
                return this.visible?states.operation.上:states.operation.不上;
            }
        }else {
            if(side === states.side.face){
                return this.visible?states.operation.搭:states.operation.不搭;
            }else {
                return !this.visible?states.operation.刮:states.operation.不刮;
            }
        }
    }
}