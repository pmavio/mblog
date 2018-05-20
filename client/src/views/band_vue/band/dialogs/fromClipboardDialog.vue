<template>
    <el-dialog
            id="fromClipboardDialogBody"
            title='从图片导入'
            :visible.sync="showDialog"
            width="780px"
            class="baseAlert">
        <el-form :model="form">
            <el-form-item label="縏带图案名称" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="縏带束数" :label-width="formLabelWidth">
                <el-input-number v-model="form.bunch" :step="2" :min="3" :max="99"></el-input-number>
            </el-form-item>
            <el-form-item label="縏带长度" :label-width="formLabelWidth">
                <el-input-number v-model="form.length" :step="1" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="预览图像" :label-width="formLabelWidth">
                <div style="display: flex; overflow-x: scroll; flex: 1;">
                    <img id="fromClipboardDialogImage"/>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取 消</el-button>
            <el-button type="primary" @click="onEnsure()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import Program from '../../../../utils/band/program/Program';

    function getImageMap(canvas){
        var ctx = canvas.getContext('2d');
        let w = canvas.width;
        let h = canvas.height;
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imgData)

        var map = [];
        var data = imgData.data;
        for(var i=0; i<data.length; i++){
            var n = data[i];

            var ci = i % 4;
            var wh = (i-ci)/4;
            var wi = wh%w;
            var hi = (wh-wi)/w;

            if(!map[hi]) map[hi] = [];
            if(!map[hi][wi]) map[hi][wi] = [];
            map[hi][wi][ci] = n;
        }
        for(var i=0; i<map.length; i++){
            var line = map[i];
            for(var j=0; j<line.length; j++){
                var block = line[j];
                var isWhite = true;
                for(var k=0; k<block.length; k++){
                    if(block[k]<200){
                        isWhite = false;
                    }
                }
                line[j] = !isWhite;
            }
        }
        return map;
    }
    /**
     * 图片压缩，默认同比例压缩
     * @param {Object} path
     *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
     * @param {Object} obj
     *   obj 对象 有 width， height， quality(0-1)
     * @param {Object} callback
     *   回调函数有一个参数，base64的字符串数据
     */
    function dealImage(path, obj, callback){
        var img = new Image();
        img.src = path;
        img.onload = function(){
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = 0.7;  // 默认图片质量为0.7
            //生成canvas

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality );
            // 回调函数返回base64的值
//            document.body.appendChild( canvas );

            callback(base64, canvas);
        }
    }
    export default {
        mounted(){
            let self = this;
            document.getElementById("fromClipboardDialogBody").addEventListener( 'paste', function( e ){
                if(!self.showDialog) return;
                let img = document.getElementById('fromClipboardDialogImage');

                var clipboardData = e.clipboardData,
                    i = 0,
                    items, item, types;

                if( clipboardData ){
                    items = clipboardData.items;

                    if( !items ){
                        return;
                    }

                    item = items[0];
                    types = clipboardData.types || [];

                    for( ; i < types.length; i++ ){
                        if( types[i] === 'Files' ){
                            item = items[i];
                            break;
                        }
                    }

                    if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
                        var blob = item.getAsFile(),
                            reader = new FileReader();

                        reader.onload = function( e ){
                            img.src = e.target.result;
                            img.onload = function () {
                                self.img = img;
                            };
                        };

                        reader.readAsDataURL( blob );
                    }
                }
            });
        },

        props:{
            showDialog: {
                type: Boolean,
                default: false,
            },
        },

        data(){
            return {
                formLabelWidth: '80px',

                img: null,

                form: {
                    name: '',
                    bunch: 17,
                    length: 40,
                },
            }
        },

        methods:{
            onEnsure(){
                let img = this.img;
                let self = this;
                dealImage(img.src, {
                    width: self.form.length,
                    height: self.form.bunch,
                }, function(base, canvas){
                    let map = getImageMap(canvas);
                    let band = Program.fromClipboardImage(map);
                    self.$emit('ensure', band);
                });
            }
        }

    }
</script>
<style>
</style>