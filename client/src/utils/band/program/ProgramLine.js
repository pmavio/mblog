import Line from '../Line';
import states from '../states';

export default class ProgramLine{

    static fromLine(line){
        if(!line) throw new Error('line不能为空');
        else if(!line instanceof Line) throw new Error('line必须为Line类型');

        

    }

    constructor(swap){
        this.face = null;
        this.back = null;
    }

}