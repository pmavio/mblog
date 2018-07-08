import Line from './Line';
import Chain from './Chain';
import Block from './Block';
import states from './states';

//背面 正面
//交换状态 unswap(上下) swaped(搭刮)
//奇数链 偶数链
//unswap 奇数链 正 正->背(下)
//unswap 偶数链 背 背->正(上)
//swaped 奇数链 正 正->背(刮)
//swaped 偶数链 背 背->正(搭)

/**
 *
 */
export default class Band{

    static fromBand(bandJson){
        let band = new Band(bandJson.bunch, bandJson.length, bandJson.initSwap);
        Object.assign(band, bandJson);
        band.lines = bandJson.lines.map(line => {
            return Line.fromLine(line);
        });
        band.init(false);
        return band;
    }

    static fromLines(lines){
        if(!lines) throw new Error('lines不能为空');
        else if(!Array.isArray(lines)) throw new Error('lines不是一个数组');
        else if(lines.length < 1) throw new Error('lines长度不能小于1');
        for(let i=0; i<lines.length; i++){
            let line = lines[i];
            if(!line instanceof Line) throw new Error('index='+i+'处不是Line类型');
        }

        let firstLine = lines[0];
        let band = new Band(firstLine.bunch, lines.length, firstLine.swap);
        band.lines = lines;
        band.init(false);

        return band;
    }

    /**
     *
     * @param bunch 束数
     * @param length 长度
     * @param initSwap 初始swap状态
     */
    constructor(bunch, length, initSwap=states.swap.unswap){
        if(!bunch) throw new Error('bunch值不能为空');
        else if(bunch < 3) throw new Error('bunch值不能小于3');
        else if(bunch % 2 === 0) throw new Error('bunch值只能为奇数');
        else if(!length) throw new Error('length值不能为空');
        else if(length < 1) throw new Error('length值不能小于1');
        else if(initSwap !== states.swap.unswap && initSwap !== states.swap.swaped){
            throw new Error('initSwap应从states.swap中取值');
        }

        this.bunch = bunch;
        this.length = length;
        this.lines = new Array(length);
        this._initSwap = initSwap;
        this.blockMap = [];
    }

    /**
     * 初始化縏带，所有束在背面
     */
    init(reset=true){
        let swap = this.initSwap;
        let blockMap = [];
        for(let li=0; li<this.length; li++){
            if(reset || !this.lines[li]){
                this.lines[li] = new Line(this.bunch, swap);
            }
            swap = !swap;
            blockMap.push(this.lines[li].blocks);
        }
        this.blockMap = blockMap;
        return blockMap;
    }

    generateProgram(){
        let program = [];
        for(let line of this.lines){
            let programLine = line.generateProgramLine();
            program.push(programLine);
        }
        return program;
    }

    get initSwap(){
        return this._initSwap;
    }

    /**
     * 切换initSwap状态
     * @param swap
     */
    set initSwap(swap){
        if(swap === this._initSwap) return;
        if(swap !== states.swap.unswap && swap !== states.swap.swaped){
            throw new Error('swap应从states.swap中取值');
        }
        this._initSwap = swap;
        for(let line of this.lines){
            line.updateSwapState(swap);
            swap = !swap;
        }
    }
}