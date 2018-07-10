import Step from './Step';
import states from '../states';
import Band from '../Band';
import Chain from "../Chain";
import Block from "../Block";
import Line from "../Line";

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

const swapKeys = Object.keys(states.operation).filter(key=>key.length ===1);
const uppers = ['零','一','二','三','四','五','六','七','八','九'];
function uppercaseToNumber(upper){
    let upperIndex = uppers.indexOf(upper);
    if(upperIndex >=0) return upperIndex;
    else if(upper === '两') return 2;
    else return upper;
}

/**
 * 处理 两边XX、X个XX 等情况
 * @param strLine
 * @param width
 * @param stepSeparator
 */
function parseStrLineToLogicStrLine(strLine, width, stepSeparator='，'){
    if(!strLine) throw new Error('strLine不能为空');

    let newStrLine = [];
    if(strLine.indexOf('两边') >= 0){
        let endIndex = strLine.indexOf('中间');
        if(endIndex <0) endIndex = strLine.length;
        let startIndex = strLine.indexOf('两边')+2;
        let repeateStr = strLine.slice(startIndex, endIndex);

        let doubleCount = 0;
        for(let i=strLine.indexOf('两边')+3; i<width; i++){
            let num = Number.parseInt(strLine[i]);
            if(!Number.isInteger(num)) break;
            doubleCount = 10*doubleCount + num;
        }
        if(strLine.indexOf('中间') > 0){
            let operationKey = strLine.split('').find(c=>swapKeys.indexOf(c)>=0);
            newStrLine.push(repeateStr);
            newStrLine.push(operationKey + (width-2*doubleCount));
            newStrLine.push(repeateStr);
        }else{
            newStrLine.push(repeateStr);
            newStrLine.push('隔'+(width-2*doubleCount));
            newStrLine.push(repeateStr);
        }
    }else if(strLine.indexOf('个') > 0){
        for(let ci=0; ci<strLine.length; ci++){
            if(strLine[ci] !== '个') {
                newStrLine.push(strLine[ci]);
                continue;
            }
            let geIndex = ci;
            //计算循环次数
            let multiple = 0;
            for(let i=geIndex-1, j=0; i>=0; i--, j++){
                let num = uppercaseToNumber(strLine[i]);
                num = Number.parseInt(num);
                if(!Number.isInteger(num)) break;
                newStrLine.pop();
                multiple = Math.pow(10, j)*num + multiple;
            }
            //未匹配到循环次数，忽略
            if(multiple === 0) continue;

            //匹配循环结束index,匹配两个有效数
            let endIndex = geIndex +1;
            for(let numCount = 0, num=0; numCount<2&&endIndex<strLine.length-1; endIndex++){
                let temp = Number.parseInt(strLine[endIndex]);
                if(!Number.isInteger(temp)){
                    //TODO 有效数加一
                    if(num > 0) numCount ++;
                    num = 0;
                    continue;
                }
                num = 10*num + temp;
            }

            let endStr = strLine[endIndex];
            if(swapKeys.indexOf(endStr) >= 0
                    || endStr === '隔'){
                endIndex--;
            }else if(Number.isInteger(Number.parseInt(endStr))){
                endIndex++;
            }

            //转换循环
            let repeateStr = strLine.slice(geIndex+1, endIndex);
            for(let i=0;i<multiple;i++)newStrLine.push(repeateStr);
            //跳过循环部分
            ci = endIndex;
        }
    }

    if(newStrLine.length>0)strLine = newStrLine.join('');

    return strLine;
}

function parseStrLineToBlocks(width, strLine, swap, side){
    let chars = strLine.split('');

    //验证有效性
    let operationKey = chars.find(c=>swapKeys.indexOf(c)>=0);
    if(!operationKey) throw Error('未匹配到关键字:' + JSON.stringify(swapKeys));
    let operation = states.operation[operationKey];
    if(operation.swap !== swap) throw Error('关键字'+operationKey+'的swap='+operation.swap+'状态与预期值'+swap+'不匹配');
    else if(operation.side !== side) throw Error('关键字'+operationKey+'的side='+operation.side+'状态与预期值'+side+'不匹配');

    let blocks = new Array(width).fill(0).map(b=>new Block(!operation.visible));
    let bi=0;
    for(let ci=0; ci<chars.length && bi < width; ci++){
        let c = chars[ci];

        let modify = null;
        let count = 0;
        let visible = null;

        //判断操作符
        if(c === operationKey){
            modify = true;
        }else if(c === '隔'){
            modify = false;
        }

        //已匹配操作符
        if(modify === null) {
            continue;
        }

        if(modify && chars[ci-1] === '不') {
            modify = false;
            count = width - bi;
        }else if(modify && (chars[ci+1] === '完' || chars[ci-1] === '全')){
            count = width - bi;
        }

        if(count === 0){
            //匹配数字
            for(let cni = ci+1; cni<chars.length; cni++){
                try{
                    let num = Number.parseInt(chars[cni]);
                    if(!Number.isInteger(num)) break;
                    count = count*10 + num;
                }catch(e){
                    if(count > 0) break;
                }
            }
        }

        visible = modify ? operation.visible : !operation.visible;

        //转换block
        if(visible !== null && count > 0){
            let end = bi+count;
            if(end > width) end = width;
            for(; bi<end; bi++) {
                blocks[bi].visible = visible;
            }
        }
    }

    return blocks;
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

    static fromStringProgram(str, bunch, initSwap=states.swap.unswap, lineSeparator='\n', sideSeparator='◆'){
        if(!str) throw new Error('str不能为空');
        let strLines = str.split(lineSeparator);

        let firstLine = strLines[0];
        if(firstLine.indexOf('上')>=0 && firstLine.indexOf('下') >= 0){
            initSwap = states.swap.unswap;
        }else if(firstLine.indexOf('刮')>=0 && firstLine.indexOf('搭') >= 0){
            initSwap = states.swap.swaped;
        }

        //获得长度
        let length = strLines.length;

        let lines = [];
        let swap = initSwap;
        //转换文字程序
        // for(let strLine of strLines){
        for(let i=0; i<strLines.length; i++){
            try {
                let strLine = strLines[i];

                //忽略空行，总长度缩减
                if (strLine.trim().length === 0) {
                    length--;
                    continue;
                }
                //获得表背链列表
                let chains = strLine.split(sideSeparator);

                //验证表背链有效性
                if (chains.length === 1) {
                    //当链数小于2时，处理隐藏不上、不下、不搭、不刮的情况
                    let chainStr = chains[0];

                    if(chainStr.indexOf('上')>=0 && chainStr.indexOf('下')<0){
                        chains.push('不下');
                    }else if(chainStr.indexOf('下')>=0 && chainStr.indexOf('上')<0){
                        chains.unshift('不上');
                    }else if(chainStr.indexOf('搭')>=0 && chainStr.indexOf('刮')<0){
                        chains.push('不刮');
                    }else if(chainStr.indexOf('刮')>=0 && chainStr.indexOf('搭')<0){
                        chains.unshift('不搭');
                    }
                }

                //区分表背链
                let faceChainStr, backChainStr;
                let [chainStr0, chainStr1] = chains;
                if (!swap) {
                    faceChainStr = chainStr1;
                    backChainStr = chainStr0;
                } else {
                    faceChainStr = chainStr0;
                    backChainStr = chainStr1;
                }

                let faceWidth = (bunch + 1) / 2, backWidth = (bunch - 1) / 2;
                //转换口语化文字程序行
                faceChainStr = parseStrLineToLogicStrLine(faceChainStr, faceWidth);
                backChainStr = parseStrLineToLogicStrLine(backChainStr, backWidth);
                //转化成blocks
                let faceBlocks = parseStrLineToBlocks(faceWidth, faceChainStr, swap, states.side.face);
                let backBlocks = parseStrLineToBlocks(backWidth, backChainStr, swap, states.side.back);

                let faceChain = Chain.fromBlocks(states.side.face, faceBlocks);
                let backChain = Chain.fromBlocks(states.side.back, backBlocks);

                let line = Line.fromChains(faceChain, backChain, swap);
                lines.push(line);
            } catch (e) {
                throw new Error('第'+(i+1)+ '行报错：' + e.message);
            }

            //更新swap状态
            swap = !swap;
        }

        return Band.fromLines(lines);
    }

    static fromClipboardImage(map){
        let bunch = map.length;
        let length = map[0].length;
        let band = new Band(bunch, length);
        let blocks = band.init();
        for(let bi=0; bi<bunch; bi++){
            for(let li=0; li<length; li++){
                blocks[li][bi].visible = map[bunch-bi-1][li];
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
            let {face, back} = program[i];

            let faceStr = Program.toProgramLineStepsString(face, swap);
            let backStr = Program.toProgramLineStepsString(back, swap);

            let left,right;
            if(swap===states.swap.unswap){
                left = backStr;
                right = faceStr;
            }else{
                left = faceStr;
                right = backStr;
            }
            str += '〔'+(i+1)+'〕'+left+'◆'+right+'\n';
            swap = !swap;
        }
        return str;
    }


    constructor(length, initSwap=states.swap.unswap){

    }

}