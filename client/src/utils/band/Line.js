import Chain from './Chain';
import states from './states';

export default class Line{

    static fromChains(oddChain, eveChain, swap=states.swap.unswap){
        if(!oddChain){
            throw new Error('传入oddChain为空');
        }else if(!oddChain instanceof Chain){
            throw new Error('传入oddChain应为Chain类型');
        }else if(!eveChain){
            throw new Error('传入eveChain为空');
        }else if(!eveChain instanceof Chain){
            throw new Error('传入eveChain应为Chain类型');
        }else if((oddChain.width-1)!==eveChain.width){
            throw new Error('oddChain的长度应比eveChain的长度大1:\noddChain.width='+oddChain.width+',eveChain.width='+eveChain.width);
        }

        let bunch = oddChain.width + eveChain.width;
        let line = new Line(bunch, swap);
        line.oddChain = oddChain;
        line.eveChain = eveChain;

        return line;
    }

    constructor(bunch, swap=states.swap.unswap){
        if(!bunch) throw new Error('bunch值不能为空');
        else if(bunch < 3) throw new Error('bunch值不能小于3');
        else if(bunch % 2 === 0) throw new Error('bunch值只能为奇数');
        else if(swap !== states.swap.unswap && swap !== states.swap.swaped){
            throw new Error('swap应从states.swap中取值');
        }

        let oddWidth = (bunch+1)/2;
        let eveWidth = (bunch-1)/2;

        this.bunch = bunch;
        this.swap = swap;
        this.oddChain = new Chain(states.parity.odd, oddWidth);
        this.eveChain = new Chain(states.parity.eve, eveWidth);
        this.blocks = new Array(bunch);
        for(let i=0; i<bunch; i++){
            let parity = i%2;
            let chain = parity===0?this.oddChain:this.eveChain;
            let ci = (i-parity)/2;
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
            odd: this.oddChain.generateProgramLineSteps(this.swap),
            eve: this.eveChain.generateProgramLineSteps(this.swap),
        };
        return programLine;
    }
}