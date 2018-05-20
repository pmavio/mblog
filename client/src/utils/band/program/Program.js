import Step from './Step';
import states from '../states';
import Band from '../Band';

function numberConvertToUppercase(num) {
    num = Number(num);
    if(num === 2) return '两';
    var upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
    var length = String(num).length;
    if (length == 1) {
        return upperCaseNumber[num];
    } else if (length == 2) {
        if (num == 10) {
            return upperCaseNumber[num];
        } else if (num > 10 && num < 20) {
            return '十' + upperCaseNumber[String(num).charAt(1)];
        } else {
            return upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '');
        }
    }
}

function strWeight(str, weight){
    return {
        str,
        weight,
    }
}

export default class Program{

    /**
     *
     * @param band
     */
    static fromBand(band){
        if(!band) throw new Error('band不能为空');
        else if(!band instanceof Band) throw new Error('band必须为Band类型');

        let program = [];
        for(let line of band.lines){
            let programLine = {

            }
        }

    }

    static fromClipboardImage(map){
        let bunch = map.length;
        let length = map[0].length;
        let band = new Band(bunch, length);
        let blocks = band.init();
        for(let bi=0; bi<bunch; bi++){
            for(let li=0; li<length; li++){
                blocks[li][bi].visible = map[bi][li];
            }
        }
        return band;
    }

    static toProgramLineStepsString(steps, swap, leftSteps, strArr=[]){
        if(!leftSteps){
            //初次建立leftSteps
            leftSteps = [...steps];

            //总共只有3步，且第一步和第三步完全一样
            //两边XX[，中间X完]
            if(leftSteps.length === 3 && leftSteps[0].isEqual(leftSteps[2])) {
                let step = leftSteps.shift();
                leftSteps.pop();
                let str = '两边' + step.getString(swap);
                step = leftSteps.shift();
                if (step.operation.name !== '隔') {
                    str += '，中间' + step.operation.name + '完';
                }
                return str;
            }
        }

        if(leftSteps.length===0){
            //没有剩余操作了，根据strArr处理分隔，拼字符串并返回
            return strArr.reduceRight((r,sw,i)=> {
                if(r.weights + sw.weight > 3 && r.strs.length > 1){
                    r.weights = 0;
                    r.strs = '，' + r.strs;
                }

                r.weights += sw.weight;
                r.strs = sw.str + r.strs;

                return r;
            }, {strs:'', weights:0}).strs;

        }else if(leftSteps.length === 1){
            // 剩余步数只有1步时
            // 不上不下不刮不搭 上完下完刮完搭完
            let step = leftSteps.shift();
            if(step.operation.name === '隔') {
                //剩余的一步是隔时
                if(steps.length === 1){
                    //总共只有一步且为隔时
                    //返回不上 不下 不刮 不搭
                    let str = step.operation.type;
                    strArr.push(strWeight(str, 1));
                }else {
                    //总操作数不止一步时，省略最后的隔
                }
            }else {
                //剩余的一步不是隔，返回X完
                let str = step.operation.name + '完';
                strArr.push(strWeight(str, 1));
            }
        }else{
            let str = '';

            //处理 X个隔XXX
            if(leftSteps[0].operation.name==='隔' && leftSteps.length >= 2*2){
                let cycleCount = 0;
                let skip = leftSteps.shift();
                let change = leftSteps.shift();
                let weight = 1;
                str += skip.getString(swap) + change.getString(swap);
                for(;
                    skip.isEqual(leftSteps[0]) && change.isEqual(leftSteps[1]);
                    cycleCount++){
                    leftSteps.shift();
                    leftSteps.shift();
                }
                if(cycleCount>0){
                    let changer = numberConvertToUppercase(cycleCount+1);
                    str = changer + '个' + str;
                    weight = 4;
                }
                strArr.push(strWeight(str, weight));
            }else{
                let step = leftSteps.shift();
                str = step.getString(swap);
                strArr.push(strWeight(str, 1));
            }
        }

        return Program.toProgramLineStepsString(steps, swap, leftSteps, strArr);
    }

    static toProgramString(program, initSwap){
        if(!program) return '';
        let str = '';
        let swap = initSwap;
        console.log(program)
        for(let i=0; i<program.length; i++){
            let {odd, eve} = program[i];

            let oddStr = Program.toProgramLineStepsString(odd, swap);
            let eveStr = Program.toProgramLineStepsString(eve, swap);

            let left,right;
            if(swap===states.swap.unswap){
                left = eveStr;
                right = oddStr;
            }else{
                left = oddStr;
                right = eveStr;
            }
            str += '〔'+(i+1)+'〕'+left+'◆'+right+'\n';
            swap = !swap;
        }
        return str;
    }


    constructor(length, initSwap=states.swap.unswap){

    }

}