import states from './states';

/**
 * 块
 */
export default class Block{

    /**
     *
     * @param visible 显示状态
     */
    constructor(visible=false){
        this.visible = visible;
    }

//unswap 奇数链 正 正->背(下)
//unswap 偶数链 背 背->正(上)
//swaped 奇数链 正 正->背(刮)
//swaped 偶数链 背 背->正(搭)

    /**
     * 根据swap，parity和自身visible值，返回操作值
     * @param swap
     * @param parity
     * @returns {*}
     */
    getOperation(swap, parity){
        if(swap === states.swap.unswap){
            if(parity === states.parity.odd){
                return !this.visible?states.operation.下:states.operation.不下;
            }else {
                return this.visible?states.operation.上:states.operation.不上;
            }
        }else {
            if(parity === states.parity.odd){
                return this.visible?states.operation.搭:states.operation.不搭;
            }else {
                return !this.visible?states.operation.刮:states.operation.不刮;
            }
        }
    }
}