<template>
    <div class="bandFlex bandEditor">
        <el-input v-if="band" v-model="band.name" placeholder="请输入图案名称"/>

        <el-row>
            图案显示大小：<el-input-number v-model="blockSize" :min="5" :max="100" label="方格尺寸"></el-input-number>
            <el-checkbox class="ml20" v-model="showBorder">显示边框</el-checkbox>
        </el-row>
        <el-card class="bandFlex bandArea">
            <!--TODO index-->

            <div v-if="blockMap" class="bandFlex bandBlockArea">
                <div v-for="(line, li) in blockMap"
                     :key="li"
                        class="bandFlex bandLine">
                    <el-tooltip effect="dark" placement="bottom">
                        <div class="lineTipText" slot="content">{{programStringArray[li]}}</div>
                        <div :style="{'width': blockSize+'px', 'height': blockSize+'px'}">{{li+1}}</div>
                    </el-tooltip>
                    <div v-for="(block, bi) in line"
                         :key="bi"
                         @click="onClickBlock(block, bi, li)"
                         @mouseenter="onMouseEnter(block, bi, li)"
                         class="bandFlex"
                         :style="{'width': blockSize+'px', 'height': blockSize+'px'}"
                         :class="{
                            bandBlockBorder: showBorder,
                            bandBlockVisible: block.visible,
                            bandBlockFaceColor: !block.visible&&bi%2===0,
                            bandBlockBackColor: !block.visible&&bi%2===1,
                            bandBlockCenterColor: !block.visible&&bi*2+1===band.bunch
                        }">
                    </div>
                    <el-tooltip effect="dark" placement="top">
                        <div class="lineTipText" slot="content">{{programStringArray[li]}}</div>
                        <div :style="{'width': blockSize+'px', 'height': blockSize+'px'}">{{li+1}}</div>
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

    export default {

        data () {
          return {
              query: {
                  name: '',
                  bunch: 17,
                  length: 64,
                  initSwap: states.swap.unswap,
              },

              editMode: 'none', //none, paint, erase
              currentMouseOn: {block:{visible:false}, bi:0, li:0},

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

              blockSize: 25,
              showBorder: true,
              formLabelWidth: '120px',

          };
        },
        methods: {

            onClickBlock(block, bi, li){
                block.visible = !block.visible;
                this.onBlockChanged(block, bi, li);
            },

            onBlockChanged(block, bi, li){
                this.program = this.band.generateProgram();
                this.programString = Program.toProgramString(this.program, this.band.initSwap);
                this.programStringArray = this.programString.split('\n');
            },

            oninitSwapChange(){
                this.onBlockChanged();
            },

            reset(){
                for(let line of this.blockMap){
                    for(let block of line) block.visible = false;
                }
                this.onBlockChanged();
            },

            onKeyDown(event){
                if(event.code === 'Digit1'){
                    this.editMode = 'paint';
                }else if(event.code === 'Digit2'){
                    this.editMode = 'erase';
                }

                let mouseOn = this.currentMouseOn;
                this.onMouseEnter(mouseOn.block, mouseOn.bi, mouseOn.li);
            },
            onKeyUp(event){
                if(event.code === 'Digit1'){
                    this.editMode = 'none';
                }else if(event.code === 'Digit2'){
                    this.editMode = 'none';
                }
            },

            onMouseEnter(block, bi, li){
                this.currentMouseOn = {
                    block, bi, li
                };

                if(this.editMode === 'paint' && !block.visible){
                    block.visible = true;
                    this.onBlockChanged();
                }else if(this.editMode === 'erase' && block.visible){
                    block.visible = false;
                    this.onBlockChanged();
                }
            },

            save(){
                let band = this.band;
                if(!band.name) {
                    this.$message({
                        showClose: true,
                        message: '请输入縏带名称',
                        type: 'warn'
                    });
                    return;
                }
                if(band.initSwap === undefined) {
                    this.$message({
                        showClose: true,
                        message: '请选择縏带初始状态',
                        type: 'warn'
                    });
                    return;
                }
                let promise = null;
                if(this.band._id){
                    promise = this.$store.dispatch('band/updateById', {
                        data: this.band.getSaveData()
                    });
                }else{
                    promise = this.$store.dispatch('band/insert', this.band.getSaveData());
                }
                promise.then(res => {
                        if(res.code === 0){
                            // 保存成功
                            this.$message({
                                showClose: true,
                                message: '保存成功',
                                type: 'success'
                            });
                            this.band._id = res.result._id;
                        }else{
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

            back(){
                this.$router.back(-1);
            },

            saveLocal(){
                let saveRes = this.$store.dispatch('band/saveBandEditorPage', {band: this.band})
            },

        },

        mounted(){
            document.body.onkeydown = this.onKeyDown;
            document.body.onkeyup = this.onKeyUp;

            let band = this.$store.state.band.bandEditor.band;

            if(!band){
                //TODO 提醒未获得数据
                return;
            }

            if(band._id) {
                this.$store.dispatch('band/getById', {_id: band._id})
                    .then(res => {
                        if(res.code === 0){
                            this.band = Band.fromBand(res.result);
                            this.blockMap = this.band.blockMap;
                            this.onBlockChanged();
                        }else{
                            //TODO 提醒id获取错误
                        }
                    })
                    .catch(err => {
                        //TODO 提示错误
                        console.error(err);
                    });
            }else{
                this.band = Band.fromBand(band);
                this.blockMap = this.band.blockMap;
                this.onBlockChanged();
            }
        },
    }
</script>
<style scoped>
    .bandFlex{
        display: flex;
        display: -webkit-flex;
    }

    .bandEditor{
        padding: 20px;
        flex-direction: column;
        flex: 1;
    }

    .bandArea{
        /*width: 100%;*/
        overflow-x:scroll;
    }

    .bandBlockArea{
        flex-direction: row;
        margin: 20px;
        /*background-color: blue;*/
    }

    .bandLine{
        flex-direction: column-reverse;
    }

    .bandBlock{
        width: 25px;
        height: 25px;
    }

    .bandBlockBorder{
        border: 1px solid #BDBDBD;
        box-sizing: border-box;
    }

    .bandBlockBackColor{
        background-color: white;
    }
    .bandBlockFaceColor{
        background-color: #e1f5fe;
    }
    .bandBlockCenterColor{
        background-color: #b3e5fc;
    }
    .bandBlockVisible{
        background-color: #000000;
    }

    .lineTipText{
        font-size: 20px;
    }
</style>
