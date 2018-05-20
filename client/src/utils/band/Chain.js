import states from './states';
import Block from './Block';
import Step from './program/Step';

export default class Chain{
    static fromBlocks(parity, blocks){
        if(!blocks) throw new Error('blocks不能为空');
        else if(!Array.isArray(blocks)) throw new Error('blocks不能为非数组');
        for(let block of blocks){
            if(!block) throw new Error('blocks[' + blocks.indexOf(block) + ']不能为空');
            else if(!block instanceof Block) throw new Error('blocks[' + blocks.indexOf(block) + ']的类型不为Block');
        }

        let width = blocks.length;

        let chain = new Chain(parity, width, false);
        chain.blocks = blocks;

        return chain;
    }

    /**
     *
     * @param parity 奇偶性
     * @param width 长度
     */
    constructor(parity, width){
        if(!Number.isInteger(width) || width<=0) throw new Error('链长度应为正整数');
        if(parity === states.parity.odd){
            if(width %2 === 0) throw new Error('奇数链长度应为奇数而不是'+width);
        }else if(parity === states.parity.eve){
            if(width %2 === 1) throw new Error('偶数链长度应为偶数而不是'+width);
        }else{
            throw new Error('链的parity值错误，应从states.parity中获取');
        }

        this.parity = parity;
        this.width = width;
        this.blocks = new Array(width).fill(null).map(n=>new Block(false));
    }

    generateProgramLineSteps(swap){
        let steps = [];
        let count = 0, lastOperation = null;
        for(let block of this.blocks){
            let operation = block.getOperation(swap, this.parity);
            if(lastOperation !== operation){
                if(count > 0 && lastOperation){
                    //记录步骤
                    steps.push(new Step(lastOperation, count));
                    count = 0;
                }
                lastOperation = operation;
            }
            count ++;
        }
        if(count>0 && lastOperation)steps.push(new Step(lastOperation, count));
        return steps;
    }
}