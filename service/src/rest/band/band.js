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

        this.get('/test', async ctx => {
            let data = "1oto73h3ho7g0\n" +
                "1hose731ose80\n" +
                "1rgese7gses00\n" +
                "v27osfoe7og0\n" +
                "e73hofs73ho0\n" +
                "4e73gfu3hos0\n" +
                "10se70871osg0\n" +
                "1hose0fvgse80\n" +
                "1otos0fvoe7g0\n" +
                "sfho0fvs73s0\n" +
                "e73g0fvu3ho0\n" +
                "7271vnvv1oi0\n" +
                "13ge3vrg3gs00\n" +
                "1hos7vtvvoe80\n" +
                "13hofvuvvs700\n" +
                "73gvvvfvu3i0\n" +
                "e71vvvnvu1o0\n" +
                "se3vvvrvu0s0\n" +
                "1os7u03to20g0\n" +
                "1hoftvtuvu780\n" +
                "13jvrvuvfufg0\n" +
                "71vnfnfnuvq0\n" +
                "e0ve73nrvvs0\n" +
                "s0evfnrtugg0\n" +
                "1og1rtutusfo0\n" +
                "1ho3hosev8vo0\n" +
                "13s7rtuvfi000\n" +
                "7eevfnrlbgf0\n" +
                "e7se73hrn080\n" +
                "7eevfnrlbgf0\n" +
                "13s7rtuvfi000\n" +
                "1ho3hosev8vo0\n" +
                "1og1rtutusfo0\n" +
                "s0evfnrtugg0\n" +
                "e0ve73nrvvs0\n" +
                "71vnfnfnuvq0\n" +
                "13gfrvuvfufg0\n" +
                "5oftvtuvu770\n" +
                "8s7uvrtvu0e0\n" +
                "he3v07rvu0s0\n" +
                "1271vvvnvu1o0\n" +
                "43gvvvfvu3g0\n" +
                "8hofvuvvs720\n" +
                "48s7vtvvoe40\n" +
                "12ge3vrg3gs00\n" +
                "1h271vnvv1og0\n" +
                "1o53g0fvu3h80\n" +
                "1s85o0fvs7880\n" +
                "1u48s0fvoe480\n" +
                "1v2he0fvgt2g0\n" +
                "1vh270871oh00\n" +
                "vo43gfu3g880\n" +
                "1fs8hofs724g0\n" +
                "1nu48sfoe4900\n" +
                "1rv2ge7gs2i00\n" +
                "1tvh2731oh400\n" +
                "1uvo53h3h8800\n" +
                "1vfs85o784g00\n" +
                "1vnu48se48vo0\n" +
                "vrv2ges2hvo0\n" +
                "1ftvh0vu13vg0\n" +
                "1nuvo1vv07v00\n" +
                "1rvfs3vvgfu00\n" +
                "1tvnu7vvovs00\n" +
                "1uvrvfnrtvo00\n" +
                "1vftvv3hvvg00\n" +
                "1vnuvvnrvuvo0\n" +
                "vrvftuvftvo0\n" +
                "1ftvnose7rvg0\n" +
                "1nuvvtuvfvv00\n" +
                "1rvfvfnrtvu00\n" +
                "1tvnu73hovs00\n" +
                "1uvrvfnrtvo00\n" +
                "1vfvrtuvg0000\n" +
                "vnvhose7vvs0\n" +
                "frvrtuvfvvo0\n" +
                "7tvvfnrtvvg0\n" +
                "3vvu73hovvvg\n" +
                "1vtvfnrtuvv0\n" +
                "10vovtuvfsg00\n" +
                "1gfgfose7o800\n" +
                "1o707tuvfg3o0\n" +
                "s003vnrv2000\n" +
                "e001v3hu5000\n" +
                "v003vnrt0g00\n" +
                "1rg07vuvoh0g0\n" +
                "1ho0fvsfka100\n" +
                "1rg0vvuv241g0\n" +
                "v3vvvvu10400\n" +
                "e7vvvvs8g400\n" +
                "sfvvvvoh0400\n" +
                "1ovvvs00a05g0\n" +
                "1hvvvo0040900\n" +
                "13vvvg0000gg0\n" +
                "7vvv01o03u00\n" +
                "fuvu03s07v00\n" +
                "vtfs07u0e1g0\n" +
                "1vrno0fv0vvo0\n" +
                "1vnrs0vvh0000\n" +
                "1vnru1vuovvo0\n" +
                "vnrs3vtte1g0\n" +
                "frno7vru7v00\n" +
                "7tfgfvnv3u00\n" +
                "3uv0vvfvggfg\n" +
                "1vv000vvo8vo\n" +
                "vvg3sfs05gs\n" +
                "fpo7u7os3vu\n" +
                "ssfv3hu3vv\n" +
                "e8s3h3v3vu\n" +
                "70vvo7vhgs\n" +
                "7s3hvvsfvp00\n" +
                "fu12vvov3sg0\n" +
                "s704s3hu1u40\n" +
                "1vvg8fv3s8v00\n" +
                "1vvog7u7osfg0\n" +
                "1vvhv3sfhu7o0\n" +
                "s73vg073v3g0\n" +
                "fu71o126th40\n" +
                "7sfvs3gfbo80\n" +
                "80nvu7ovnsg0\n" +
                "g17vsfgfbp00\n" +
                "10231ov26ti00\n" +
                "gfhvhu73v400\n" +
                "8vov3sfhu700\n" +
                "5vse7ovose40\n" +
                "3ge4fhnc8se0\n" +
                "7vvav3qu1ov0\n" +
                "7vvh07tv3i00\n" +
                "7vvav3qu1ov0\n" +
                "3ge4fhnc8se0\n" +
                "5vse7ovose40\n" +
                "8vov3sfhu700\n" +
                "gfhvhu73v400\n" +
                "14231ov26ti00\n" +
                "g17vsfgfbp00\n" +
                "80nvu7ovnsg0\n" +
                "7sfvs3gfbo80\n" +
                "fu71o126th40\n" +
                "s73vg073v3g0\n" +
                "1vvhv3sfhu7o0\n" +
                "1vvog7u7osfg0\n" +
                "1vvg8fv3s8v00\n" +
                "s704s3hu1u40\n" +
                "fu12vvov3sg0\n" +
                "7s3hvvsfvp00\n" +
                "70vvo7vhgs\n" +
                "e8s3h3v3vu\n" +
                "ssfv3hu3vv\n" +
                "fpo7u7os3vu\n" +
                "vvg3sfs05gs\n" +
                "1vv000vvo8vo\n" +
                "3uv0vvfvggfg\n" +
                "7tfgfvnv3u00\n" +
                "frno7vru7v00\n" +
                "vnrs3vtte1g0\n" +
                "1vnru1vuovvo0\n" +
                "1vnrs0vvh0000\n" +
                "1vrno0fv0vvo0\n" +
                "vtfs07u0e1g0\n" +
                "fuvu03s07v00\n" +
                "7vvv01o03u00\n" +
                "13vvvg0000gg0\n" +
                "1hvvvo0040900\n" +
                "1ovvvs00a05g0\n" +
                "sfvvvvoh0400\n" +
                "e7vvvvs8g400\n" +
                "v3vvvvu10400\n" +
                "1rg0vvuv241g0\n" +
                "1ho0fvsfka100\n" +
                "1rg07vuvoh0g0\n" +
                "v003vnrt0g00\n" +
                "e001v3hu5000\n" +
                "s003vnrv2000\n" +
                "1o707tuvfg3o0\n" +
                "1gfgfose7o800\n" +
                "10vovtuvfsg00\n" +
                "1vtvfnrtuvv0\n" +
                "3vvu73hovvvg\n" +
                "7tvvfnrtvvg0\n" +
                "frvrtuvfvvo0\n" +
                "vnvhose7vvs0\n" +
                "1vfvrtuvg0000\n" +
                "1uvrvfnrtvo00\n" +
                "1tvnu73hovs00\n" +
                "1rvfvfnrtvu00\n" +
                "1nuvvtuvfvv00\n" +
                "1ftvnose7rvg0\n" +
                "vrvftuvftvo0\n" +
                "1vnuvvnrvuvo0\n" +
                "1vftvv3hvvg00\n" +
                "1uvrvfnrtvo00\n" +
                "1tvnu7vvovs00\n" +
                "1rvfs3vvgfu00\n" +
                "1nuvo1vv07v00\n" +
                "1ftvh0vu13vg0\n" +
                "vrv2ges2hvo0\n" +
                "1vnu48se48vo0\n" +
                "1vfs85o784g00\n" +
                "1uvo53h3h8800\n" +
                "1tvh2731oh400\n" +
                "1rv2ge7gs2i00\n" +
                "1nu48sfoe4900\n" +
                "1fs8hofs724g0\n" +
                "vo43gfu3g880\n" +
                "1vh270871oh00\n" +
                "1v2he0fvgt2g0\n" +
                "1u48s0fvoe480\n" +
                "1s85o0fvs7880\n" +
                "1o53g0fvu3h80\n" +
                "1h271vnvv1og0\n" +
                "12ge3vrg3gs00\n" +
                "48s7vtvvoe40\n" +
                "8hofvuvvs720\n" +
                "43gvvvfvu3g0\n" +
                "1271vvvnvu1o0\n" +
                "he3vvvrvu0s0\n" +
                "8s7u03to20e0\n" +
                "5oftvtuvu770\n" +
                "13jvrvuvfufg0\n" +
                "71vnfnfnuvq0\n" +
                "e0ve73nrvvs0\n" +
                "s0evfnrtugg0\n" +
                "1og1rtutusfo0\n" +
                "1ho3hosev8vo0\n" +
                "13s7rtuvfi000\n" +
                "7eevfnrlbgf0\n" +
                "e7se73hrn080\n" +
                "7eevfnrlbgf0\n" +
                "13s7rtuvfi000\n" +
                "1ho3hosev8vo0\n" +
                "1og1rtutusfo0\n" +
                "s0evfnrtugg0\n" +
                "e0ve73nrvvs0\n" +
                "71vnfnfnuvq0\n" +
                "13jvrvuvfufg0\n" +
                "1hoftvtuvu780\n" +
                "1os7u03to20g0\n" +
                "se3vvvrvu0s0\n" +
                "e71vvvnvu1o0\n" +
                "73gvvvfvu3i0\n" +
                "13hofvuvvs700\n" +
                "1hos7vtvvoe80\n" +
                "13ge3vrg3gs00\n" +
                "7271vnvv1oi0\n" +
                "e73g0fvu3ho0\n" +
                "sfho0fvs73s0\n" +
                "1otos0fvoe7g0\n" +
                "1hose0fvgse80\n" +
                "10se70871osg0\n" +
                "4e73gfu3hos0\n" +
                "e73hofs73ho0\n" +
                "v27osfoe7og0\n" +
                "1rgese7gses00\n" +
                "1hose731ose80\n" +
                "1oto73h3ho7g0"
            ctx.body = data
                .split('\n')
                .map(line => {
                    let str = Number.parseInt(line, 32).toString(2);
                    // if(str) return str;
                    line = str.split('')
                        .reverse()      //压缩时防止解压后图案"掉"到底部，解压时需要配合反转回来
                        .map(c=>c==='1'?8:'.')
                        .join('');
                    let fillBlockLength = band.bunch-line.length;
                    if(fillBlockLength){
                        line.push(...new Array(fillBlockLength).fill(0).map(b=>0));
                    }
                    return line;
                })
                .join('\n');
        })
    }
}