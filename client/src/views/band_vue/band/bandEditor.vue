<template>
    <div class="bandFlex bandEditor">
        <div class="bandFlex divLine mt10">
            <div class="w150">图案名称：</div>
            <div style="width: 500px">
                <el-input class="w200" v-if="band" v-model="band.name" placeholder="请输入图案名称"/>
            </div>
        </div>

        <div class="bandFlex divLine mt10">
            <div class="w150">图案显示大小：</div>
            <div >
                <el-input-number v-model="blockSize" :min="5" :max="100" label="方格尺寸"></el-input-number>
            </div>
            <div >
                <el-checkbox class="ml20" v-model="showBorder">显示边框</el-checkbox>
            </div>
        </div>

        <div class="bandFlex divLine mt10">
            <div class="w150">阅读语速：</div>
            <div class="w300">
                <el-slider class="w200"
                        v-model="speakRate"
                        :step="0.05"
                        :min="0.5"
                        :max="1.5">
                </el-slider>
            </div>
            <div class="w150">选择朗读人：</div>
            <el-select v-model="speaker" placeholder="请选择">
                <el-option
                        v-for="item in speakers"
                        :key="item.voiceURI"
                        :label="item.name"
                        :value="item">
                </el-option>
            </el-select>
        </div>

        <div class="bandFlex divLine mt10">
            <el-button @click="copyPicture()">展示成品图</el-button>
        </div>

        <el-card class="bandFlex bandArea mt10">
            <!--TODO index-->

            <div id="divBlockMap" v-if="blockMap" class="bandFlex bandBlockArea">
                <div v-for="(line, li) in blockMap"
                     :key="li"
                     class="bandFlex bandLine">
                    <el-tooltip effect="dark" placement="bottom">
                        <div class="lineTipText" slot="content">{{programStringArray[li]}}</div>
                        <div
                                class="bandLineController"
                                :style="{'width': blockSize+'px', 'height': blockSize+'px'}"
                                @click="onClickLine(li)">
                        {{li + 1}}
                        </div>
                    </el-tooltip>

                    <div v-for="(block, bi) in line"
                         :key="bi"
                         @click="onClickBlock(block, bi, li)"
                         @mouseenter="onMouseEnter(block, bi, li)"
                         class="bandFlex"
                         :style="{'width': blockSize+'px', 'height': blockSize+'px'}"
                         :class="{
                            bandBlockBorder: showBorder,
                            bandLineFocusTop: showBorder&&focusLineIndex===li&&bi===band.bunch-1,
                            bandLineFocusMid: showBorder&&focusLineIndex===li&&bi!==band.bunch-1&&bi!==0,
                            bandLineFocusBot: showBorder&&focusLineIndex===li&&bi===0,
                            bandBlockVisible: block.visible,
                            bandBlockFaceColor: !block.visible&&bi%2===0,
                            bandBlockBackColor: !block.visible&&bi%2===1,
                            bandBlockCenterColor: !block.visible&&bi*2+1===band.bunch
                        }">
                    </div>

                    <el-tooltip effect="dark" placement="top">
                        <div class="lineTipText" slot="content">{{programStringArray[li]}}</div>
                        <div
                                class="bandLineController"
                                :style="{'width': blockSize+'px', 'height': blockSize+'px'}"
                                @click="onClickLine(li)">
                            {{li + 1}}
                        </div>
                    </el-tooltip>
                </div>


            </div>
        </el-card>

        <el-select v-if="band" v-model="band.initSwap" @change="oninitSwapChange()">
            <el-option v-for="(item,i) in initSwapOptions"
                       :key="item.label"
                       :value="item.value"
                       :label="item.label"></el-option>
        </el-select>
        <el-button @click="reset(band)">重置</el-button>

        <el-row v-if="band" style="width: 100%" ref="programeString">
            <el-input
                    type="textarea"
                    autosize
                    v-model="programString">
            </el-input>
        </el-row>

        <el-row>
            <el-button @click="save()">保存</el-button>
            <el-button @click="back()">返回</el-button>
        </el-row>

        <image-dialog
            :showDialog="showImage"
            :title="band.name"
            :imgSrc="blockMapBase64"
            :loading="blockMapBase64Loading"
        >

        </image-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Band from '../../../utils/band/Band';
    import Line from '../../../utils/band/Line';
    import Chain from '../../../utils/band/Chain';
    import Block from '../../../utils/band/Block';
    import states from '../../../utils/band/states';
    import Program from '../../../utils/band/program/Program';

    import Bitmap from '../../../utils/Bitmap';
    import html2canvas from '../../../utils/html2canvas.min';
    import cavas2image from '../../../utils/canvas2image';

    import imageDialog from './dialogs/imageDialog.vue';

    export default {

        components: {
            imageDialog,
        },

        data() {
            return {
                query: {
                    name: '',
                    bunch: 17,
                    length: 64,
                    initSwap: states.swap.unswap,
                },

                editMode: 'none', //none, paint, erase
                currentMouseOn: {block: {visible: false}, bi: 0, li: 0},

                initSwapOptions: [
                    {value: states.swap.unswap, label: '先上下'},
                    {value: states.swap.swaped, label: '先刮搭'},
                ],

                band: {
                    name: '',
                    bunch: 17,
                    length: 64,
                    initSwap: states.swap.unswap,
                },

                blockMap: [],
                program: [],
                programStringArray: [],
                programString: '',

                focusLineIndex: -1,

                blockSize: 25,
                showBorder: true,
                formLabelWidth: '120px',

                showImage: false,
                blockMapBase64: '',
                blockMapBase64Loading: false,

                speakRate: 0.7,
                speaker: null,
                speakers: [],
            };
        },
        methods: {

            onClickBlock(block, bi, li) {
                block.visible = !block.visible;
                this.onBlockChanged(block, bi, li);
            },

            onBlockChanged(block, bi, li) {
                if(!this.band instanceof Band) {
                    console.error(this.band, 'is not instance of Band');
                    return;
                }
                this.program = this.band.generateProgram();
                this.programString = Program.toProgramString(this.program, this.band.initSwap);
                this.programStringArray = this.programString.split('\n');
            },

            oninitSwapChange() {
                this.onBlockChanged();
            },

            onClickLine(li) {
                if(this.focusLineIndex === li) {
                    if(window.speechSynthesis.paused) {
                        window.speechSynthesis.resume();
                        return;
                    }else if(window.speechSynthesis.speaking) {
                        window.speechSynthesis.pause();
                        return;
                    }
                }
                this.focusLineIndex = this.focusLineIndex === li ? -1 : li;
                let lineToRead = this.programStringArray[li];
                try {
                    lineToRead = lineToRead.replace('〔', '第');
                    lineToRead = lineToRead.replace('〕', '摆。');
                    lineToRead = lineToRead.replace('◆', '。');
                }catch(e){
                    console.error(e);
                }
                window.speechSynthesis.cancel();

                let lastReadLine = new window.SpeechSynthesisUtterance(lineToRead);
                lastReadLine.rate = this.speakRate;
                if(this.speaker) lastReadLine.voice = this.speaker;
                window.speechSynthesis.speak(lastReadLine);
            },

            reset() {
                for (let line of this.blockMap) {
                    for (let block of line) block.visible = false;
                }
                this.onBlockChanged();
            },

            onKeyDown(event) {
                if (event.code === 'Digit1') {
                    this.editMode = 'paint';
                } else if (event.code === 'Digit2') {
                    this.editMode = 'erase';
                }

                let mouseOn = this.currentMouseOn;
                this.onMouseEnter(mouseOn.block, mouseOn.bi, mouseOn.li);
            },
            onKeyUp(event) {
                if (event.code === 'Digit1') {
                    this.editMode = 'none';
                } else if (event.code === 'Digit2') {
                    this.editMode = 'none';
                }
            },

            onMouseEnter(block, bi, li) {
                this.currentMouseOn = {
                    block, bi, li
                };

                if (this.editMode === 'paint' && !block.visible) {
                    block.visible = true;
                    this.onBlockChanged();
                } else if (this.editMode === 'erase' && block.visible) {
                    block.visible = false;
                    this.onBlockChanged();
                }
            },

            save() {
                let band = this.band;
                if (!band.name) {
                    this.$message({
                        showClose: true,
                        message: '请输入縏带名称',
                        type: 'warn'
                    });
                    return;
                }
                if (band.initSwap === undefined) {
                    this.$message({
                        showClose: true,
                        message: '请选择縏带初始状态',
                        type: 'warn'
                    });
                    return;
                }
                let promise = null;
                if (this.band._id) {
                    promise = this.$store.dispatch('band/updateById', {
                        data: this.band.getSaveData()
                    });
                } else {
                    promise = this.$store.dispatch('band/insert', this.band.getSaveData());
                }
                promise.then(res => {
                    if (res.code === 0) {
                        // 保存成功
                        this.$message({
                            showClose: true,
                            message: '保存成功',
                            type: 'success'
                        });
                        this.band._id = res.result._id;
                    } else {
                        this.$message({
                            showClose: true,
                            message: '保存失败:\n' + res.message,
                            type: 'error'
                        });
                    }
                    this.saveLocal();
                })
                    .catch(err => {
                        console.error(err);
                        this.$message({
                            showClose: true,
                            message: '保存出错:\n' + err.message,
                            type: 'error'
                        });
                    })
            },

            back() {
                this.$router.back(-1);
            },

            saveLocal() {
                let saveRes = this.$store.dispatch('band/saveBandEditorPage', {band: this.band})
            },

            copyPicture() {
                this.showImage = true;
                this.blockMapBase64Loading = true;
                setTimeout(() =>{
                    let divBlockMap = document.getElementById('divBlockMap');
                    this.htmlToCanvas(divBlockMap)
                        .then(canvas => {
                            return cavas2image.convertToJPEG(canvas);
                        })
                        .then(img => {
                            this.blockMapBase64 = img.src;
                            this.blockMapBase64Loading = false;
                        });
                }, 50);
            },

            //获取像素密度
            getPixelRatio: function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            },
            //绘制dom 元素，生成截图canvas
            htmlToCanvas: function (dom) {
                var shareContent = dom;// 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
                var width = shareContent.offsetWidth;  // 获取(原生）dom 宽度
                var height = shareContent.offsetHeight; // 获取(原生）dom 高
                var offsetTop = shareContent.offsetTop;  //元素距离顶部的偏移量

                var canvas = document.createElement('canvas');  //创建canvas 对象
                var context = canvas.getContext('2d');
                var scaleBy = this.getPixelRatio(context);  //获取像素密度的方法 (也可以采用自定义缩放比例)
                canvas.width = width * scaleBy;   //这里 由于绘制的dom 为固定宽度，居中，所以没有偏移
                canvas.height = (height + offsetTop) * scaleBy;  // 注意高度问题，由于顶部有个距离所以要加上顶部的距离，解决图像高度偏移问题
                context.scale(scaleBy, scaleBy);

                var opts = {
                    allowTaint: true,//允许加载跨域的图片
                    tainttest: true, //检测每张图片都已经加载完成
                    scale: scaleBy, // 添加的scale 参数
                    canvas: canvas, //自定义 canvas
                    logging: false, //日志开关，发布的时候记得改成false
                    width: width, //dom 原始宽度
                    height: height //dom 原始高度
                };
                return html2canvas(shareContent, opts)
            },

            initSpeakers() {
                let task = setInterval(() => {
                    let speakers = speechSynthesis.getVoices();
                    if(speakers && speakers.length > 0){
                        clearInterval(task);
                        this.speakers = speakers.filter(s => s.localService && s.lang.indexOf('zh')>=0);
                        this.speaker = this.speakers[0];
                    }
                }, 1000);
            },
        },

        mounted() {
            document.body.onkeydown = this.onKeyDown;
            document.body.onkeyup = this.onKeyUp;
            this.initSpeakers();

            let band = this.$store.state.band.bandEditor.band;

            if (!band) {
                //TODO 提醒未获得数据
                return;
            }

            if (band._id) {
                this.$store.dispatch('band/getById', {_id: band._id})
                    .then(res => {
                        if (res.code === 0) {
                            this.band = Band.fromBand(res.result);
                            this.blockMap = this.band.blockMap;
                            this.onBlockChanged();
                        } else {
                            //TODO 提醒id获取错误
                        }
                    })
                    .catch(err => {
                        //TODO 提示错误
                        console.error(err);
                    });
            } else {
                this.band = Band.fromBand(band);
                this.blockMap = this.band.blockMap;
                this.onBlockChanged();
            }
        },

    }
</script>
<style scoped>
    .bandFlex {
        display: flex;
        display: -webkit-flex;
    }

    .bandEditor {
        padding: 20px;
        flex-direction: column;
        flex: 1;
    }

    .bandArea {
        /*width: 100%;*/
        overflow-x: scroll;
    }

    .bandBlockArea {
        flex-direction: row;
        margin: 20px;
        /*background-color: blue;*/
    }

    .bandLine {
        flex-direction: column-reverse;
    }

    .bandBlock {
        width: 25px;
        height: 25px;
    }

    .bandBlockBorder {
        border: 1px solid #BDBDBD;
        box-sizing: border-box;
    }

    .bandLineFocusTop {
        border-top: 3px solid #ff4d51;
        border-left: 3px solid #ff4d51;
        border-right: 3px solid #ff4d51;
        box-sizing: border-box;
    }

    .bandLineFocusMid {
        border-left: 3px solid #ff4d51;
        border-right: 3px solid #ff4d51;
        box-sizing: border-box;
    }

    .bandLineFocusBot {
        border-bottom: 3px solid #ff4d51;
        border-left: 3px solid #ff4d51;
        border-right: 3px solid #ff4d51;
        box-sizing: border-box;
    }

    .bandBlockBackColor {
        background-color: white;
    }

    .bandBlockFaceColor {
        background-color: #e1f5fe;
    }

    .bandBlockCenterColor {
        background-color: #b3e5fc;
    }

    .bandBlockVisible {
        background-color: #000000;
    }

    .lineTipText {
        font-size: 20px;
    }

    .bandLineController {
        text-align: center;
    }
    .bandLineController:hover {
        background-color: #ff4d51;
    }

    /*.el-tooltip__popper[x-placement^=top] .popper__arrow:after {*/
        /*border-top-color: blue;*/
    /*}*/
    /*.el-tooltip__popper[x-placement^=top] .popper__arrow {*/
        /*border-top-color: blue;*/
    /*}*/

    .divLine {
        flex-direction: row;
        align-items: center;
    }
</style>
