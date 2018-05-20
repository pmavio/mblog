<template>
    <div>
        <el-form ref="form" :inline="true" :model="form" label-width="80px">

            <el-form-item class="ant-condition-button">
                <el-button type="primary" class="w100" @click="newbandDialogVisible=true">添加</el-button>
            </el-form-item>
        </el-form>

        <!--表格部分-->
        <el-table :data="tableData" :fit='true' style="width: 100%" class="listTable">
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.$index +1}}</span>
                </template>
            </el-table-column>

            <el-table-column label="縏带名称" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="縏带束数" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.bunch }}</span>
                </template>
            </el-table-column>

            <el-table-column label="縏带长度" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.length }}</span>
                </template>
            </el-table-column>

            <el-table-column label="初始状态" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.initSwap?"先刮搭":"先上下" }}</span>
                </template>
            </el-table-column>

        </el-table>

        <!--分页效果-->
        <div class="bandBlock" style="float: right; margin: 10px 3px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.currentPage" :page-sizes="pageSizes" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        </div>


        <el-dialog title="新增縏带" :visible.sync="newbandDialogVisible">
            <el-form :model="newbandForm">
                <el-form-item label="縏带图案名称" :label-width="formLabelWidth">
                    <el-input v-model="newbandForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="编织初始状态" :label-width="formLabelWidth">
                    <el-select v-model="newbandForm.initSwap" placeholder="请选择初始状态">
                        <el-option v-for="item in initSwapOptions" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="縏带束数" :label-width="formLabelWidth">
                    <el-input v-model="newbandForm.bunch" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="縏带初始长度" :label-width="formLabelWidth">
                    <el-input v-model="newbandForm.length" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newbandDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onNewband">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import states from '../../../utils/band/states';
    export default {
        created() {
        },
        mounted: function () {
            this.getConferenceCondition();
        },
        data() {
            return {
                initSwapOptions: [
                    {value: states.swap.unswap, label: "先上下"},
                    {value: states.swap.swaped, label: "先刮搭"},
                ],

                formLabelWidth: '120px',
                newbandDialogVisible: false,
                newbandForm: {
                    name: '',
                    initSwap: states.swap.unswap,
                    bunch: 17,
                    length: 64,
                },

                conference_area:[],
                pageSizes: [10, 20, 30, 40],
                total: 0, //分页的数据Int类型
                form: {
                    pageSize: 10,
                },
                tableData:[]
            }
        },
        methods: {
            handleSizeChange(val) {
                this.form.pageSize = val;
                this.getConferenceCondition()

            },
            handleCurrentChange(val) {
                this.form.currentPage = val; //当前页
                this.getConferenceCondition()
            },

            //修改启用状态
            changeSwitchValue(data){
                //TODO
            },

            //根据条件筛选数据
            getConferenceCondition(type){
                return this.$store.dispatch('band/getList',this.form).then(res=>{
                    this.total = res.total
                    if (res.code == 0) {
                        this.tableData = res.result
                    } else {
                        this.tableData = []
                        this.total = 0
                    }
                })
            },
            onNewband(){
                this.newbandDialogVisible = false;
                this.$router.push({
                    path: '/band/bandEditor',
                    query: this.newbandForm,
                })
            },
            //管理操作
            handleEdit(index,data){
                this.$router.push({
                    path: '/conference/RegistrationEdit',
                    query: {
                        _id:data._id,
                        "currentPage": this.form.currentPage,
                        "pageSize": this.form.pageSize,
                        "conference_area":this.form.conference_area,//办公区域
                        "videoManger":this.form.videoManger,//办公大楼
                        "conference_state": this.form.conference_state,//启用状态
                    }
                })
            },
            //删除操作
            handleDelete(index,data){
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.tableData.count < 0) return;
                    return this.$store.dispatch('conferenceRegistration/conferenceDelete',{ _id: data._id,conference_video: data.conference_video }).then(res=>{
                        if(res.code===0){
                            this.getConferenceCondition()
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                customClass:'cusNotice'
                            });
                        }else{
                            console.log("删除失败的信息==",res)
                            this.$message({
                                type: 'warning',
                                message: res.message,
                                customClass:'warnNotice'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getMessage(message){
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                });
            },
        }
    };
</script>

<style>
    .bandBlock .el-input__inner{
        height: 30px !important;
    }

</style>
