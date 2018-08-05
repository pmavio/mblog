<template>
    <el-dialog
            :title="title"
            :visible.sync="visible"
            class="baseAlert">
        <img v-if="!loading" :src="imgSrc"/>
        <h2 v-else>图片正在生成</h2>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {

        props: {
            title: {
                type: String,
                default: '标题',
            },
            imgSrc: {
                type: String,
            },
            showDialog: {
                type: Boolean,
                default: false,
            },
            loading:{
                type: Boolean,
                default: false,
            }
        },

        watch: {
            showDialog () {
                this.visible = this.showDialog;
            }
        },

        data(){
            return {
                visible: this.showDialog,
            }
        }
    }
</script>
<style>
</style>