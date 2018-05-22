<template>
    <div class="bandFlex bandEditor">
        <el-input v-if="band" v-model="band.name" placeholder="请输入图案名称"/>

        <el-card class="bandFlex bandArea">
            <!--TODO index-->

            <div v-if="blockMap" class="bandFlex bandBlockArea">
                <div v-for="(line, li) in blockMap"
                     :key="li"
                        class="bandFlex bandLine">
                    <div v-for="(block, bi) in line"
                         :key="bi"
                         @click="onClickBlock(block, bi, li)"
                         @mouseenter="onMouseEnter(block, bi, li)"
                        class="bandFlex bandBlock bandBlockBorder"
                         :class="{
                            bandBlockVisible: block.visible,
                            bandBlockFaceColor: !block.visible&&bi%2===0,
                            bandBlockBackColor: !block.visible&&bi%2===1,
                            bandBlockCenterColor: !block.visible&&bi*2+1===band.bunch
                        }">
                    </div>
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

        <el-dialog title="从文字程序导入縏带" :visible.sync="importFromProgrameStringDialogVisible">
            <el-form :model="importFromProgrameStringForm">
                <el-form-item label="縏带图案名称" :label-width="formLabelWidth">
                    <el-input v-model="importFromProgrameStringForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="编织初始状态" :label-width="formLabelWidth">
                    <el-select v-model="importFromProgrameStringForm.initSwap" placeholder="请选择初始状态">
                        <el-option v-for="item in initSwapOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="縏带束数" :label-width="formLabelWidth">
                    <el-input v-model="importFromProgrameStringForm.width" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="行分隔符" :label-width="formLabelWidth">
                    <el-input v-model="importFromProgrameStringForm.lineSeparator" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="面分隔符" :label-width="formLabelWidth">
                    <el-input v-model="importFromProgrameStringForm.sideSeparator" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="文字程序" :label-width="formLabelWidth">
                    <el-input
                            v-model="importFromProgrameStringForm.programeString"
                            type="textarea"
                            :rows="10"
                            auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importFromProgrameStringDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="importFromProgrameString">确 定</el-button>
            </div>
        </el-dialog>
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

              band: null,
              blockMap: [],
              program: [],
              programString: '',

              formLabelWidth: '120px',

              importFromProgrameStringDialogVisible: false,
              importFromProgrameStringForm:{
                  name: '',
                  initSwap: states.swap.unswap,
                  bunch: 17,
                  lineSeparator: '\\n',
                  sideSeparator: '//',
                  programeString: '',
              },

              clipboardDialogVisible: false,
          };
        },
        methods: {
            importFromProgrameString(){
                this.importFromProgrameStringDialogVisible = false;

                let form = this.importFromProgrameStringForm;
                this.band = bandUtils.fromProgrameString(form.name, form.initSwap, form.bunch, form.programeString, form.lineSeparator, form.sideSeparator);
            },

            generateCanvas(){
//                this.band.initband();
            },

            onClickBlock(block, bi, li){
                block.visible = !block.visible;
                this.onBlockChanged(block, bi, li);
            },

            onBlockChanged(block, bi, li){
                this.program = this.band.generateProgram();
                this.programString = Program.toProgramString(this.program, this.band.initSwap);
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
                        data: this.band
                    });
                }else{
                    promise = this.$store.dispatch('band/insert', this.band);
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

            if(band){
                console.log('get local band =', band);
                this.band = Band.fromBand(band);
                this.blockMap = this.band.blockMap;
            }else{
                if(this.$route && this.$route.query){
                    this.query = this.$route.query;
                }
                let {name, initSwap, bunch, length} = this.query;
                if(bunch && length){
                    bunch = Number(bunch);
                    length = Number(length);
                    initSwap = Boolean(initSwap);
                    this.band = new Band(bunch, length, initSwap);
                    this.band.name = name;
                    this.blockMap = this.band.init();
                }
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
    }

    .bandBlockOddColor{
        background-color: white;
    }
    .bandBlockEveColor{
        background-color: #e1f5fe;
    }
    .bandBlockCenterColor{
        background-color: #b3e5fc   ;
    }
    .bandBlockVisible{
        background-color: #000000;
    }

</style>
