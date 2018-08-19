<template>
    <el-dialog
            title='登录'
            :visible.sync="visible"
            @close="$emit('close')"
            width="300px"
            class="baseAlert">
        <el-form :model="form">
            <el-form-item class="ant-condition-button">
                <el-input v-model="form.username" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item class="ant-condition-button">
                <el-input type="password" v-model="form.password" placeholder="请输入密码"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="login()">登 录</el-button>
        </div>
    </el-dialog>
</template>

<script>
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

                form: {
                    username: '',
                    password: '',
                },
            }
        },

        methods:{
            login(){
                this.$store.dispatch('user/login', this.form)
                    .then(res => {
                        if(res.code === 0){
                            this.$emit('onLogined', res.result);
                            this.visible = false;
                        }
                    })
            },
        }

    }
</script>
<style>
</style>