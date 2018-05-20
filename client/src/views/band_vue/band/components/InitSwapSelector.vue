<template>
    <el-select v-model="swap" @change="oninitSwapChange()">
        <el-option v-for="(item,i) in initSwapOptions"
                   :key="i"
                   :value="item.value"
                   :label="item.label"></el-option>
    </el-select>
</template>

<script>
    import states from '../../../../utils/band/states';
    export default {

        props:{
            swap: {
                type: Boolean,
                default: states.swap.unswap,
            },
        },

        data(){
            return {
                initSwapOptions: [
                    {value: states.swap.unswap, label: '先上下'},
                    {value: states.swap.swaped, label: '先刮搭'},
                ],
            }
        }

    }
</script>
<style>
</style>