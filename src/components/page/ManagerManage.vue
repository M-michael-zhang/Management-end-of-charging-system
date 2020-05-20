<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <i class="el-icon-lx-calendar"></i> 员工管理
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.searchValue" placeholder="请输入id，用户名或手机号" class="handle-input mr10" @input="searchChange"></el-input>
                <el-button type="primary" icon="el-icon-lx-roundadd" @click="handleInsert">新增</el-button>
            </div>

            <el-table
                    :data="queryData.list"
                    border
                    class="table"
                    v-loading="loading"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="200" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
                <el-table-column prop="department" label="部门"></el-table-column>
                <el-table-column prop="permission" width="150"label="权限" :formatter="formatterFunc"></el-table-column>
                <el-table-column prop="createTime" width="200" label="创建时间"></el-table-column>
                <el-table-column prop="contact" width="150" label="联系方式"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
                        @current-change="handlePageChange"
                        @size-change="handlePageSizeChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="formRules">
                <el-form-item label="ID" prop="id">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名"  prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="密码"  prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="手机号"  prop="contact">
                    <el-input v-model="form.contact"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-select v-model="form.permission" placeholder="请选择权限">
                        <el-option label="仅查看" value="0"></el-option>
                        <el-option label="仅维修" value="1"></el-option>
                        <el-option label="可查看,编辑" value="2"></el-option>
                        <el-option label="可查看,维修" value="3"></el-option>
                        <el-option label="可查看,编辑,维修" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="insertVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="formRules">
                <el-form-item label="ID" prop="id">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名"  prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="密码"  prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="手机号"  prop="contact">
                    <el-input v-model="form.contact"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-select v-model="form.permission" placeholder="请选择权限">
                        <el-option label="仅查看" value="0"></el-option>
                        <el-option label="仅维修" value="1"></el-option>
                        <el-option label="可查看,编辑" value="2"></el-option>
                        <el-option label="可查看,维修" value="3"></el-option>
                        <el-option label="可查看,编辑,维修" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllManager,selectManagerByThinkWithPage,updateManager,insertManager,deleteManager } from '../../api/index';
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    searchValue:'',
                    pageIndex:1,
                    pageSize:10
                },
                options: [
                    { label: '用户名' },
                    { label: 'ID' },
                    { label: '联系方式' }
                ],
                queryData: [],
                delList: [],
                editVisible: false,
                insertVisible:false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                loading:false,
                formRules:{
                    name: [
                        { required: true, message: '用户名必输', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码必输', trigger: 'blur' }
                    ],
                    contact: [
                        { required: true, message: '联系方式必输', trigger: 'blur' }
                    ]
                },
                paseId:''
            };
        },
        created() {
            this.getData();

        },
        methods: {
            formatterFunc(row, column) {
                if(column.property==='permission'){
                    return row.permission === '0' ? '仅查看' : row.permission === '1' ? '仅维修' : row.permission === '2' ? '可查看,编辑': row.permission === '3' ? '可查看,维修': row.permission === '4' ? '可查看,编辑,维修':''
                }
            },
            getData() {
                this.loading = true
                getAllManager(this.query).then(res => {
                    console.log(res);
                    this.queryData = res.extend.Managers;
                    this.pageTotal = this.queryData.total;
                    this.loading = false
                });
            },
            delSearchResult(res){
                if(res.code===100){
                    this.queryData = res.extend.Managers;
                    this.pageTotal = res.extend.Managers.total ;
                }else{
                    this.queryData = [];
                    this.pageTotal = 0 ;
                }
            },
            //搜索输入监听
            searchChange(v){
                if(v===''){
                    this.getData()
                }else{
                    this.query.searchValue=v
                    selectManagerByThinkWithPage(this.query).then(ref=>{
                        this.delSearchResult(ref);
                    })
                }
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteManager(row.id).then(ref=>{
                            if(ref.code == '100'){
                                this.queryData.list.splice(index, 1);
                                this.$message.success(ref.msg);
                                this.pageTotal -=1
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
            },
            handleInsert(){
                this.form={}
                this.insertVisible = true;
            },
            // 保存编辑
            saveEdit() {

                updateManager(this.form).then(ref => {
                    if(ref.code!=100){
                        this.$message.error(ref.msg)
                    }else{
                        this.$message.success(`修改成功`);
                        this.editVisible = false;
                        this.$set(this.queryData.list, this.idx, this.form);
                    }
                })

            },
            //保存新增
            saveInsert(){
                console.log(this.form.license)
                if(this.form.name==undefined||this.form.password==undefined||this.form.contact==undefined){
                    this.$message.error("姓名，密码和联系方式不能为空")
                }else{
                    insertManager(this.form).then(ref=>{
                        if(ref.code!=100){
                            this.$message.error(ref.msg)
                        }else{
                            this.$message.success(`新增成功`);
                            console.log(this.form)
                            this.getData()
                            this.insertVisible = false;
                        }

                    })
                }

            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },
            handlePageSizeChange(val){
                this.$set(this.query, 'pageSize', val);
                this.getData();
            }
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
        width: 300px;
        display: inline-block;
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
        color: #000000;
    }
</style>
