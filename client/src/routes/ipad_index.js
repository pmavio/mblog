import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import conferenceBoard from './../views/ipad_vue/ipad/conferenceBoard.vue'
// import error from './../views/components/error/500.vue'
import error from './../views/components/error/500.vue'
// import CTest from '@/components/CTest'
// import MTest from '@/components/MTest'
// import MsSlider from '@/components/MsSlider'
// import addPer from '@/components/addPer'
// const HelloWorld = () =>
//     import ('../components/HelloWorld');
// const CTest = () =>
//     import ('@/components/CTest');
// const MTest = () =>
//     import ('@/components/MTest');

// const HelloWorld = r => require.ensure([], () => r(require('../components/' + h)), 'chunkname1')
// const CTest = r => require.ensure([], () => r(require('@/components/CTest')), 'chunkname1')
// const MTest = r => require.ensure([], () => r(require('@/components/MTest')), 'chunkname3')


const router = new Router({
    mode: 'history',
    routes: [{
        path: '/ipad/',
        component: conferenceBoard
    }, {
        path: '/ipad/error',
        component: error
    }]
});



export default router