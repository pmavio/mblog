<template>
    <el-dialog
            title='从文字程序导入'
            :visible.sync="visible"
            @close="$emit('close')"
            width="780px"
            class="baseAlert">
        <el-form :model="form">
            <el-form-item label="图案名称" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="縏带束数" :label-width="formLabelWidth">
                <el-input-number v-model="form.bunch" :step="2" :min="3" :max="99"></el-input-number>
            </el-form-item>
            <el-form-item label="面分隔符" :label-width="formLabelWidth">
                <el-input v-model="form.sideSeparator"></el-input>
            </el-form-item>
            <el-form-item label="文字程序" :label-width="formLabelWidth">
                <el-input v-model="form.str" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="onEnsure()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import Program from '../../../../utils/band/program/Program';

    export default {

        props:{
            showDialog: {
                type: Boolean,
                default: false,
            },
        },

        watch: {
            showDialog () {
                this.visible = this.showDialog;
            }
        },

        data(){
            return {
                visible: this.showDialog,

                formLabelWidth: '80px',

                img: null,

                form: {
                    name: '',
                    sideSeparator: '◆',
                    bunch: 17,
                    str: '',
                },
            }
        },

        methods:{
            onEnsure(){
                let band = Program.fromStringProgram(this.form.str, this.form.bunch, false, '\n', this.form.sideSeparator);
                band.name = this.form.name;
                this.$emit('ensure', band);
            }
        }

    }
</script>
<style>
</style>