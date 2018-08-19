<template>
    <div>
        <el-form ref="form" :inline="true" :model="form" label-width="80px">

            <el-form-item class="ant-condition-button">
                <el-button type="primary" class="w100" @click="newBandDialogVisible=true">添加</el-button>
            </el-form-item>
            <el-form-item class="ant-condition-button">
                <el-button type="primary" class="w150" @click="stringDialogVisible=true">从文字程序导入</el-button>
            </el-form-item>
            <el-form-item class="ant-condition-button">
                <el-button type="primary" class="w150" @click="clipboardDialogVisible=true">从图片导入</el-button>
            </el-form-item>
            <el-form-item class="ant-condition-button">
                <el-button type="primary" class="w150" @click="loginOrLogout()">{{isUserLogin?'登出':'登录'}}</el-button>
            </el-form-item>
        </el-form>

        <el-form ref="formFilters" :inline="true" :model="form" label-width="80px">
            <el-form-item >
                <el-input v-model="form.name" placeholder="搜索名称"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input v-model.number="form.bunch" placeholder="搜索束数"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" class="w150" @click="search()">搜索</el-button>
            </el-form-item>
        </el-form>

        <!--表格部分-->
        <el-table :data="tableData" :fit='true' style="width: 100%" class="listTable">
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.$index + 1}}</span>
                </template>
            </el-table-column>

            <el-table-column label="缩略图" width="400" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.bitmapBase64"/>
                </template>
            </el-table-column>

            <el-table-column label="縏带名称" width="400" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="縏带束数" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.bunch }}</span>
                </template>
            </el-table-column>

            <el-table-column label="縏带摆数" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.length }}</span>
                </template>
            </el-table-column>

            <el-table-column label="初始状态" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.initSwap ? "先刮搭" : "先上下" }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="handleDelete(scope.row._id)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页效果-->
        <div class="bandBlock" style="float: right; margin: 10px 3px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="form.currentPage" :page-sizes="pageSizes" :page-size="form.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        </div>


        <el-dialog title="新增縏带" :visible.sync="newBandDialogVisible">
            <el-form :model="newbandForm">
                <el-form-item label="縏带图案名称" :label-width="formLabelWidth">
                    <el-input v-model="newbandForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="编织初始状态" :label-width="formLabelWidth">
                    <el-select v-model="newbandForm.initSwap" placeholder="请选择初始状态">
                        <el-option v-for="item in initSwapOptions" :key="item.label" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="縏带束数" :label-width="formLabelWidth">
                    <el-input v-model="newbandForm.bunch" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="縏带初始摆数" :label-width="formLabelWidth">
                    <el-input v-model="newbandForm.length" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newBandDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onNewband">确 定</el-button>
            </div>
        </el-dialog>

        <from-string-dialog
                :showDialog="stringDialogVisible"
                @ensure="onFromString"
                @close="stringDialogVisible=false"
        ></from-string-dialog>
        <from-clipboard-dialog
                :showDialog="clipboardDialogVisible"
                @ensure="onFromClipboard"
                @close="clipboardDialogVisible=false"
        ></from-clipboard-dialog>

        <el-dialog
                title="提示"
                :visible.sync="deleteDialogVisible"
                width="30%">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="handleDelete()">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import fromStringDialog from './dialogs/fromStringDialog.vue';
    import fromClipboardDialog from './dialogs/fromClipboardDialog.vue';

    import Band from '../../../utils/band/Band';
    import states from '../../../utils/band/states';

    export default {
        components: {
            fromStringDialog,
            fromClipboardDialog,
        },

        created() {
        },

        mounted: function () {
            this.getBandList();
        },

        computed: {
            user(){
                return this.$store.state.user.user || {};
            },
            isUserLogin(){
                return this.$store.state.user.user !== null;
            },
        },

        data() {
            let pageSizes = [20, 40, 80, 200];
            console.log('user =', this.$store.state.user.user);
            return {

                initSwapOptions: [
                    {value: states.swap.unswap, label: "先上下"},
                    {value: states.swap.swaped, label: "先刮搭"},
                ],

                formLabelWidth: '120px',
                newBandDialogVisible: false,
                newbandForm: {
                    name: '',
                    initSwap: states.swap.unswap,
                    bunch: 17,
                    length: 64,
                },
                clipboardDialogVisible: false,
                stringDialogVisible: false,

                deleteDialogVisible: false,
                bandIdToDelete: null,

                pageSizes: pageSizes,
                total: 0, //分页的数据Int类型
                form: {
                    pageSize: pageSizes[0],
                    currentPage: 1,

                    name: null,
                    bunch: null,
                },
                tableData: []
            }
        },
        methods: {
            loginOrLogout(){
                if(this.isUserLogin){
                    this.$confirm('确认退出登录？')
                        .then(_ => {
                            this.$store.dispatch('user/logout');
                            this.$message('登出成功');
                        })
                        .catch(_ => {});
                }else{
                    this.$store.dispatch('user/shouldLogin');
                }
            },

            handleSizeChange(val) {
                this.form.pageSize = val;
                this.getBandList()

            },
            handleCurrentChange(val) {
                this.form.currentPage = val; //当前页
                this.getBandList()
            },

            search(){
                this.form.currentPage = 1;
                return this.getBandList();
            },

            //根据条件筛选数据
            getBandList() {
                return this.$store.dispatch('band/getList', this.form).then(res => {
                    this.total = res.total;
                    if (res.code === 0) {
                        this.tableData = res.result
                        this.total = res.total ? res.total : 0;
                    } else {
                        this.tableData = [];
                        this.total = 1;
                    }
                })
            },
            onNewband() {
                this.newBandDialogVisible = false;

                let {name, initSwap, bunch, length} = this.newbandForm;
                if (bunch && length) {
                    bunch = Number(bunch);
                    length = Number(length);
                    initSwap = Boolean(initSwap);
                    let band = new Band(bunch, length, initSwap);
                    band.name = name;
                    this.$store.dispatch('band/saveBandEditorPage', {band})
                    this.gotoBandEditor();
                }
            },
            onFromClipboard(band) {
                this.clipboardDialogVisible = false;
                if (!band || !band instanceof Band) return;
                this.$store.dispatch('band/saveBandEditorPage', {band})
                this.gotoBandEditor();
            },
            onFromString(band) {
                this.stringDialogVisible = false;
                if (!band || !band instanceof Band) return;
                this.$store.dispatch('band/saveBandEditorPage', {band})
                this.gotoBandEditor();
            },

            handleEdit(band) {
                if (!band || !band instanceof Band) return;
                this.$store.dispatch('band/saveBandEditorPage', {band});
                this.gotoBandEditor();
            },

            gotoBandEditor(){
                this.$store.dispatch('user/checkUserLogin', true)
                    .then(res => {
                        if(!res) return;
                        this.$router.push({
                            path: '/band/bandEditor',
                        });
                    });
            },

            handleDelete(_id) {
                if(this.deleteDialogVisible){
                    this.deleteDialogVisible = false;
                    _id = this.bandIdToDelete;
                    this.bandIdToDelete = null;
                    return this.$store.dispatch('band/deleteById', {_id})
                        .then(res => {
                            if(res.code === 0){
                                return this.getBandList();
                            }
                        })
                }else{
                    this.deleteDialogVisible = true;
                    this.bandIdToDelete = _id;
                }
            },
        }
    };
</script>

<style>
    .bandBlock .el-input__inner {
        height: 30px !important;
    }

</style>
