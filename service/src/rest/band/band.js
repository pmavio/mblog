import BaseRouter from '../BaseRouter';
import dbModels from '../../db/dbModels';
import Bitmap from '../../utils/Bitmap';

export default class band extends BaseRouter{

    getTableName(){
        return 'band';
    }

    initRoutes(dbModel){
        this.get('/updateData', async ctx => {
            let allData = await dbModel.getList({}, {_id: 1}).exec();
            let result = [];
            for(let item of allData){
                let _id = item._id.toString();
                let {name, bunch, length, blockMap} = await dbModel.getById(_id, {name:1, bunch:1, length:1, blockMap:1});

                if(!blockMap) continue;

                let bitmap = new Bitmap();
                bitmap.create(length, bunch, 0xFFFFFF);
                let bitData = [];
                for(let x=0;x<blockMap.length;x++){
                    let line = blockMap[x];
                    let bitLine = [];
                    for(let y=0;y<line.length;y++){
                        let block = line[y];
                        if(block.visible===true)bitmap.setPixel(x,line.length-y-1, 0x000000);
                        bitLine.push(block.visible?1:0);
                    }
                    bitData.push(bitLine);
                }
                let bitmapBase64 = bitmap.toBase64();


                let updateResult = await dbModel.dbModel.update({_id}, {
                    $set: {bitmapBase64, bitData},
                    $unset: {lines: 1, blockMap: 1},
                });

                result.push({name, updateResult, bitmapBase64});
            }
            ctx.body = result;
        });

    }

    getDefaultConditions(query){
        let condition = BaseRouter.prototype.getDefaultConditions(query);
        if(condition){
            if(condition.name)condition.name = new RegExp(condition.name);
            else if(condition.name === '') delete condition.name;
            if(condition.bunch === '') delete condition.bunch;
        }
        return condition;
    }
}