import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import bandList from './../views/band_vue/band/bandList.vue'
import bandEditor from './../views/band_vue/band/bandEditor.vue'


const router = new Router({
    mode: 'history',
    routes: [{
        path: '/band/',
        component: bandList
    },{
        path: '/band/bandEditor',
        component: bandEditor
    }]
});



export default router