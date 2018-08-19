<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view :key="activeTime"></router-view>
        </transition>

        <login-dialog :showDialog="showLoginDialog" @onLogined="onLogined()" @close="closeLoginDialog()"></login-dialog>
    </div>
</template>

<script>
    import loginDialog from './publicComponents/loginDialog.vue';


    export default {
        name: 'app',
        components: {
            loginDialog,
        },

        computed: {
            activeTime(){
                return this.$store.state.user.activeTime;
            },
            showLoginDialog(){
                return this.$store.state.user.showLoginDialog;
            }
        },

        data(){
            return {
            }
        },

        methods: {
            onLogined: function(){
                this.$store.dispatch('user/reload');
            },
            closeLoginDialog: function () {
                this.$store.dispatch('user/closeLoginDialog');
            }
        },

    }
</script>
<style>
    @import '../../assets/css/public.css';
</style>