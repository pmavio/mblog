import states from './states';
import Block from './Block';
import Step from './program/Step';

export default class Chain{

    static fromChain(chainJson){
        let chain = new Chain(chainJson.side, chainJson.width);
        chain.blocks = chainJson.blocks.map(block => {
            return Block.fromBlock(block);
        });
        return chain;
    }

    static fromBlocks(side, blocks){
        if(!blocks) throw new Error('blocks不能为空');
        else if(!Array.isArray(blocks)) throw new Error('blocks不能为非数组');
        for(let block of blocks){
            if(block === undefined || block === null) throw new Error('blocks[' + blocks.indexOf(block) + ']不能为空');
            else if(!block instanceof Block) throw new Error('blocks[' + blocks.indexOf(block) + ']的类型不为Block');
        }

        let width = blocks.length;

        let chain = new Chain(side, width, false);
        chain.blocks = blocks;

        return chain;
    }

    /**
     *
     * @param side 表背面
     * @param width 长度
     */
    constructor(side, width){
        if(!Number.isInteger(width) || width<=0) throw new Error('链长度应为正整数');

        this.side = side;
        this.width = width;
        this.blocks = new Array(width).fill(null).map(n=>new Block(false));
    }

    generateProgramLineSteps(swap){
        let steps = [];
        let count = 0, lastOperation = null;
        for(let block of this.blocks){
            let operation = block.getOperation(swap, this.side);
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