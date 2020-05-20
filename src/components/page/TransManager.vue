<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <i class="el-icon-lx-calendar"></i> 系统管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
                </el-breadcrumb>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="myInputGroup">
                    <el-input v-model="query.searchValues.searchSerial" placeholder="请输入流水号" class="handle-input mr10" >
                        <template slot="prepend">流水号</template>
                    </el-input>
                    <el-input v-model="query.searchValues.searchPid" placeholder="请输入充电桩ID" class="handle-input mr10" >
                        <template slot="prepend">充电桩ID</template>
                    </el-input>
                    <el-input v-model="query.searchValues.searchUid" placeholder="请输入用户ID" class="handle-input mr10" >
                        <template slot="prepend">用户ID</template>
                    </el-input>

                </div>
                <div class="myInputGroup">


                    <el-date-picker
                            style="width: 32%;margin-right: 10px"
                            v-model="query.searchValues.searchDate"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyyMMdd">

                    </el-date-picker>

                    <el-select style="width: 32%;margin-right: 10px" v-model="query.searchValues.searchType" placeholder="请选择交易类型">
                        <el-option label="预约充电" value="0"></el-option>
                        <el-option label="实时充电" value="1"></el-option>
                        <el-option label="所有" value=""></el-option>
                    </el-select>
                    <el-select style="width: 32%;margin-right: 10px" v-model="query.searchValues.searchStatus" placeholder="请选择交易状态">
                        <el-option label="进行中" value="0"></el-option>
                        <el-option label="已结束" value="1"></el-option>
                        <el-option label="所有" value=""></el-option>
                    </el-select>
                </div>
                <el-button type="primary" @click="resetForm">重置</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                    :data="queryData.list"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="loading"
                    header-cell-class-name="table-header"
            >
<!--                <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="serialNo" label="流水号" width="160" align="center"></el-table-column>
                <el-table-column prop="uid" width="100" label="用户ID"></el-table-column>
                <el-table-column prop="pid" width="100" label="充电桩ID"></el-table-column>
                <el-table-column prop="transTime" width="160"  label="交易时间">
<!--                    <template slot-scope="scope">￥{{scope.row.amount}}</template>-->
                </el-table-column>

                <el-table-column prop="type" label="交易类型" :formatter="formatterFunc"></el-table-column>
                <el-table-column prop="status" label="交易状态" :formatter="formatterFunc"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="160" ></el-table-column>
                <el-table-column prop="costTime" label="用时/时"></el-table-column>
                <el-table-column prop="amount" width="交易金额">
                    <template slot-scope="scope">￥{{scope.row.amount}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total,sizes, prev, pager, next, jumper"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        :page-sizes="[5, 10, 20, 50,100,200]"
                        @current-change="handlePageChange"
                        @size-change="handlePageSizeChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" >
                <el-form-item label="流水号"><el-input v-model="form.serialNo" :disabled="true"></el-input></el-form-item>
                <el-form-item label="用户ID" prop="uid"><el-input v-model="form.uid"></el-input></el-form-item>
                <el-form-item label="充电桩ID" prop="pid"><el-input v-model="form.pid"></el-input></el-form-item>
                <el-form-item label="交易类型" prop="type">
                    <el-select v-model="form.type" placeholder="">
                        <el-option label="预约充电" value="0"></el-option>
                        <el-option label="实时充电" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易状态" prop="status">
                    <el-select v-model="form.status" placeholder="">
                        <el-option label="进行中" value="0"></el-option>
                        <el-option label="已结束" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易金额"><el-input v-model="form.amount"></el-input></el-form-item>
                <el-form-item label="交易时间" prop="transTime">
                    <el-date-picker
                            v-model="form.transTime"
                            type="datetime"
                            placeholder="选择交易时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            placeholder="选择结束时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {getAllTrans,getTransSelective,updateTrans,deleteTrans } from '../../api/index';
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    pageIndex:1,
                    pageSize:5,
                    searchValues:{
                        searchSerial:'',
                        searchType:'',
                        searchStatus:'',
                        searchUid:'',
                        searchPid:'',
                        searchDate:''
                    }
                },
                queryData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                insertVisible:false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                rules: {
                    status: [
                        { required: true, message: '请输入状态', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '请输入类型' }
                    ],
                    uid:[
                        { required: true, message: '用户id不能为空',trigger:'blur' }
                    ],
                    pid:[
                        { required: true, message: '充电桩id不能为空',trigger:'blur' }
                    ],
                    endTime:[
                        { required: true, message: '交易时间不能为空',trigger:'blur' }
                    ]
                },
                loading:false,

            };
        },
        created() {
            this.getData();
        },
        methods: {
            formatterFunc(row, column) {
                if(column.property==='type'){
                    return row.type === '0' ? '预约充电' : row.type === '1' ? '实时充电' : ''
                }
                if(column.property==='status'){
                    return row.status === '0' ? '进行中' : row.status === '1' ? '已结束' :''
                }
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                this.loading=true
                getAllTrans(this.query).then(res => {
                    this.queryData = res.extend.Trans;
                    this.pageTotal = this.queryData.total;
                    this.loading=false
                });
            },
            // 触发搜索按钮
            handleSearch() {
                    this.loading=true
                    getTransSelective(this.query.searchValues).then(res => {
                        this.loading=false
                        if(res.code==100){
                            this.queryData = res.extend.Trans;
                            this.pageTotal = res.extend.Trans.total;
                        }else{
                            this.queryData = [];
                            this.pageTotal = 0;
                        }
                    });
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteTrans(row.serialNo).then(ref=>{
                            if(ref.code == '100'){
                                this.queryData.list.splice(index, 1);
                                this.pageTotal -=1
                                this.$message.success(ref.msg);
                            }else{
                                this.$message.error(ref.msg);
                            }

                        })

                    })
                    .catch(() => {});
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
                console.log(this.form.transTime)
            },
            // 保存编辑
            saveEdit() {
                updateTrans(this.form).then(ref => {
                    if(ref.code!=100){
                        this.$message.error(ref.msg)
                    }else{
                        this.$message.success(`修改成功`);
                        this.$set(this.queryData.list, this.idx, this.form);
                        this.editVisible = false;
                    }
                })

            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },
            handlePageSizeChange(val){
                this.$set(this.query, 'pageSize', val);
                this.getData();
            },
            resetForm(){
                this.query.searchValues={}
                this.getData()
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 32%;

    }
    .myInputGroup{
        width: 100%;
        margin-bottom: 20px;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    .tips {
        font-size: 12px;
        line-height: 30px;
        color: #34B458;
    }
</style>
