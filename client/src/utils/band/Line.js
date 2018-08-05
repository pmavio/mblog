import Chain from './Chain';
import states from './states';

export default class Line{

    static fromLine(lineJson){
        let line = new Line(lineJson.bunch, lineJson.swap);
        line.faceChain = Chain.fromChain(lineJson.faceChain);
        line.backChain = Chain.fromChain(lineJson.backChain);
        line.initBlocks();
        return line;
    }

    static fromChains(faceChain, backChain, swap=states.swap.unswap){
        if(!faceChain){
            throw new Error('传入faceChain为空');
        }else if(!faceChain instanceof Chain){
            throw new Error('传入faceChain应为Chain类型');
        }else if(!backChain){
            throw new Error('传入backChain为空');
        }else if(!backChain instanceof Chain){
            throw new Error('传入backChain应为Chain类型');
        }else if(faceChain.width-backChain.width!==1){
            throw new Error('faceChain和backChain的长度差应该为1:\nfaceChain.width='+faceChain.width+',backChain.width='+backChain.width);
        }

        let bunch = faceChain.width + backChain.width;
        let line = new Line(bunch, swap);
        line.faceChain = faceChain;
        line.backChain = backChain;
        line.initBlocks();

        return line;
    }

    static fromBlocks(blocks, swap){
        if(!blocks) throw new Error('传入blocks为空');
        else if(!Array.isArray(blocks)) throw new Error('传入blocks不是数组');
        else if(blocks.length<3) throw new Error('传入blocks长度不能小于3');
        else if(swap === undefined || swap === undefined) throw new Error('传入swap为空');

        let bunch = blocks.length;
        let line = new Line(bunch, swap);

        line.blocks = blocks;
        let faceChainBlocks = [];
        let backChainBlocks = [];
        for(let i=0; i<blocks.length; i++){
            let chainBlocks = i%2===0?faceChainBlocks:backChainBlocks;
            chainBlocks.push(blocks[i]);
        }
        line.faceChain = Chain.fromBlocks(states.side.face, faceChainBlocks);
        line.backChain = Chain.fromBlocks(states.side.back, backChainBlocks);

        return line;
    }

    constructor(bunch, swap=states.swap.unswap){
        if(!bunch) throw new Error('bunch值不能为空');
        else if(bunch < 3) throw new Error('bunch值不能小于3');
        else if(bunch % 2 === 0) throw new Error('bunch值只能为奇数');
        else if(swap !== states.swap.unswap && swap !== states.swap.swaped){
            throw new Error('swap应从states.swap中取值');
        }

        let faceWidth = (bunch+1)/2;
        let backWidth = (bunch-1)/2;

        this.bunch = bunch;
        this.swap = swap;
        this.faceChain = new Chain(states.side.face, faceWidth);
        this.backChain = new Chain(states.side.back, backWidth);
        this.initBlocks();
    }

    initBlocks(){
        let bunch = this.bunch;
        this.blocks = new Array(bunch);
        for(let i=0; i<bunch; i++){
            let side = i%2;
            let chain = side===0?this.faceChain:this.backChain;
            let ci = (i-side)/2;
            let block = chain.blocks[ci];
            // this.blocks[bunch-i-1] = block;
            this.blocks[i] = block;
        }
    }

    updateSwapState(swap){
        if(swap === this.swap) return;
        if(swap !== states.swap.unswap && swap !== states.swap.swaped){
            throw new Error('swap应从states.swap中取值');
        }
        this.swap = swap;
        // this.programLine = Line.generateProgramLine(this);
    }

    generateProgramLine(){
        let programLine = {
            face: this.faceChain.generateProgramLineSteps(this.swap),
            back: this.backChain.generateProgramLineSteps(this.swap),
        };
        return programLine;
    }
}