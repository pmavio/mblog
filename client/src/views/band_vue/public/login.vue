<template>
    <div>
        <el-form ref="form" :inline="true" :model="form" label-width="80px">

            <el-form-item class="ant-condition-button">
                <el-button type="primary" class="w150" @click="login()">登录</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        components: {
        },

        created() {
        },

        mounted: function () {

        },

        data() {
            return {
                form: {
                    username: '',
                    password: '',
                }
            }
        },

        methods: {
            login(){
                this.$store.dispatch('user/login', this.form)
                    .then(res => {
                        if(res.code === 0){
                            this.$router.push({
                                path: '/band/',
                            });
                        }
                    })
            },
        }
    };
</script>

<style>
</style>
