<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <i class="el-icon-lx-calendar"></i> 系统管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>充电桩管理</el-breadcrumb-item>
                </el-breadcrumb>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.searchValue" placeholder="请输入ID" class="handle-input mr10"  @input='searchChange'></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-roundadd" @click="handleInsert">新增</el-button>
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
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="type" label="类型" :formatter="formatterFunc"></el-table-column>
                <el-table-column prop="reserve1" width="200" label="地址"></el-table-column>
                <el-table-column prop="locationX" width="150" label="经度">
<!--                    <template slot-scope="scope">￥{{scope.row.amount}}</template>-->
                </el-table-column>

                <el-table-column prop="locationY" width="150" label="纬度"></el-table-column>
                <el-table-column prop="voltage" label="电压"></el-table-column>
                <el-table-column prop="electricity" label="电流"></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="formatterFunc"></el-table-column>
                <el-table-column prop="createTime" width="200" label="创建时间"></el-table-column>
                <el-table-column prop="qrcode" label="二维码"></el-table-column>
                <el-table-column prop="qrcodePath "  width="200" label="二维码路径"></el-table-column>
                <el-table-column prop="rate" label="费率"></el-table-column>
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
                        @current-change="handlePageChange"
                        @size-change="handlePageSizeChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" >
                <el-form-item label="ID">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option label="直流" value="0"></el-option>
                        <el-option label="交流" value="1"></el-option>
                        <el-option label="直流/交流" value="2"></el-option>
                    </el-select>
                </el-form-item>
<!--                <el-form-item label="地址" prop="address">-->
<!--                    &lt;!&ndash;                    <el-input v-model="form.address"></el-input>&ndash;&gt;-->
<!--                    <el-cascader :options="pileAddress" v-model="form.addressOptions" @active-item-change="handleItemChange"></el-cascader>-->
<!--                </el-form-item>-->
                <el-form-item label="经度" prop="locationX"><el-input v-model="form.locationX"></el-input></el-form-item>

                <el-form-item label="纬度" prop="locationY"><el-input v-model="form.locationY"></el-input></el-form-item>
                <el-form-item label="电压"><el-input color="red" v-model="form.voltage"></el-input></el-form-item>
                <el-form-item label="电流"><el-input v-model="form.electricity"></el-input></el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" placeholder="">
                        <el-option label="空闲" value="0"></el-option>
                        <el-option label="使用中" value="1"></el-option>
                        <el-option label="被预约" value="2"></el-option>
                        <el-option label="待维修" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间"  prop="createTime">
<!--                    <el-input v-model="form.createTime" :disabled="true"></el-input>-->
                    <el-date-picker
                            v-model="form.createTime"
                            type="datetime"
                            placeholder="选择创建时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="二维码"><el-input v-model="form.qrcode"></el-input></el-form-item>
                <el-form-item label="费率" prop="rate"><el-input v-model="form.rate"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="insertVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" >
                <el-form-item label="ID">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option label="直流" value="0"></el-option>
                        <el-option label="交流" value="1"></el-option>
                        <el-option label="直流/交流" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址" prop="address">
<!--                    <el-input v-model="form.address"></el-input>-->
                    <el-cascader :options="pileAddress" v-model="form.addressOptions" @active-item-change="handleItemChange"></el-cascader>
                </el-form-item>
                <el-form-item label="经度" prop="locationX">
                    <el-input v-model="form.locationX"></el-input>
                </el-form-item>

                <el-form-item label="纬度" prop="locationY">
                    <el-input v-model="form.locationY"></el-input>
                    </el-form-item>
                <el-form-item label="电压"><el-input color="red" v-model="form.voltage"></el-input></el-form-item>
                <el-form-item label="电流"><el-input v-model="form.electricity"></el-input></el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" placeholder="请选择状态">
                        <el-option label="空闲" value="0"></el-option>
                        <el-option label="使用中" value="1"></el-option>
                        <el-option label="被预约" value="2"></el-option>
                        <el-option label="待维修" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
<!--                    <el-input v-model="form.createTime" :disabled="true"></el-input>-->
                    <el-date-picker
                            v-model="form.createTime"
                            type="datetime"
                            placeholder="选择创建时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="二维码"><el-input v-model="form.qrcode"></el-input></el-form-item>
                <el-form-item label="费率" prop="rate"><el-input v-model="form.rate"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button @click="resetForm">重置</el-button>
                <el-button type="primary" @click="saveInsert">确 定</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllPile,getPileById,updatePile,insertPile,deletePile,getProvince,getCity,getCounty,getTown } from '../../api/index';
    import { localAddressOptions } from '../../utils/addressUtil';
    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    pageIndex:1,
                    pageSize:10,
                    searchValue: ''
                },
                queryData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                insertVisible:false,
                pageTotal: 0,
                form: {},
                form1: {
                    name:'',
                    password:''
                },
                idx: -1,
                id: -1,
                rules: {
                    address: [
                        { required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    locationX: [
                        { required: true, message: '经度不能为空', trigger: 'blur' },
                        {pattern:/^(-)?(0\.\d+|[1-9]\d?(\.\d+)?|[1][1-7]\d(\.\d+)?|180|0)$/, message: '范围在-180(西经180°)到180(东经180°)之间'}
                    ],
                    locationY: [
                        { required: true, message: '请输入纬度', trigger: 'blur' },
                        { pattern:/^(-)?(0\.\d+|[1-9](\.\d+)?|[1-8]\d(\.\d+)?|90|0)$/, message: '范围在-90(南纬90°)到90(北纬90°)之间'}
                    ],
                    status: [
                        { required: true, message: '请输入状态', trigger: 'change' }
                    ],
                    rate: [
                        { required: true, message: '请输入费率', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请输入类型' }
                    ],
                    createTime:[
                        {required:true, message:'创建时间不能为空',trigger:'blur'}
                    ]
                },
                pileAddress:[],
                loading:false,
                currentProvince:'',
                currentCity:'',
                currentCounty:'',

            };
        },
        created() {
            this.getData();
            this.setProvince();
        },
        methods: {
            formatterFunc(row, column) {
                if(column.property==='type'){
                    return row.type === '0' ? '直流' : row.type === '1' ? '交流' : row.type === '2' ? '交流/直流':''
                }
                if(column.property==='status'){
                    return row.status === '0' ? '空闲' : row.status === '1' ? '使用中' : row.status === '2' ? '被预约': row.status === '3' ? '待维修' : ''
                }
            },
            setProvince() {
                getProvince(this.query).then(res =>{
                    var provinceArray = res.extend.Province;
                    this.pileAddress=[]
                    provinceArray.forEach((item,index)=>{
                        var province={};
                        province.value = index+'-'+item.provinceId;
                        province.label = item.provinceName;
                        province.children=[];
                        this.pileAddress.push(province)
                    });
                })
            },
            handleItemChange(val){
                var length = val.length;
                switch (length) {
                    case 1:this.setCitys(val[0]);break;
                    case 2:this.setCounty(val[1]);break;
                    case 3:this.setTown(val[2]);break;
                }
            },
            setCitys(provinceItem){
                var provinceIndex = provinceItem.split('-')[0];
                var provinceId = provinceItem.split('-')[1];
                this.currentProvince = provinceIndex;
                this.pileAddress[provinceIndex].children=[];
                getCity(provinceId).then(res=>{
                    if(res.code==100){
                        var cityArray = res.extend.City;
                        cityArray.forEach((item,index)=>{
                            var city = {};
                            city.value = index+'-'+item.cityId;
                            city.label = item.cityName;
                            city.children=[];
                            this.pileAddress[provinceIndex].children.push(city);
                        });
                    }
                })
            },
            setCounty(cityItem){
                var cityIndex = cityItem.split('-')[0];
                var cityId = cityItem.split('-')[1];
                this.currentCity = cityIndex;
                this.pileAddress[this.currentProvince].children[this.currentCity].children=[]
                getCounty(cityId).then(res=>{
                    if(res.code==100){
                        var countyArray = res.extend.County;
                        countyArray.forEach((item,index)=>{
                            var county = {};
                            county.value = index+'-'+item.countyId;
                            county.label = item.countyName;
                            county.children=[];
                            this.pileAddress[this.currentProvince].children[this.currentCity].children.push(county);
                        });
                    }
                })
            },
            setTown(countyItem){
                var countyIndex = countyItem.split('-')[0];
                var countyId = countyItem.split('-')[1];
                this.currentCounty = countyIndex;
                this.pileAddress[this.currentProvince].children[this.currentCity].children[this.currentCounty].children=[]
                getTown(countyId).then(res=>{
                    if(res.code==100){
                        var townArray = res.extend.Town;
                        townArray.forEach((item,index)=>{
                            var town = {};
                            town.value = index+'-'+item.townId;
                            town.label = item.townName;
                            this.pileAddress[this.currentProvince].children[this.currentCity].children[this.currentCounty].children.push(town);
                        });
                    }
                })
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                this.loading=true
                getAllPile(this.query).then(res => {
                    this.queryData = res.extend.Piles;
                    this.pageTotal = this.queryData.total;
                    this.loading=false
                });
            },
            // 触发搜索按钮
            handleSearch() {

                if(this.query.searchValue==''){
                    this.getData()
                }else{
                    this.loading=true
                    getPileById(this.query).then(res => {
                        this.loading=false
                        if(res.code==100){
                            this.queryData = res.extend.Piles;
                            this.pageTotal = res.extend.Piles.total;
                        }else{
                            this.queryData = [];
                            this.pageTotal = 0;
                        }
                    });
                }
            },
            //搜索输入监听
            searchChange(v){
                if(v===''){
                    this.getData()
                }
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deletePile(row.id).then(ref=>{
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
                // this.form.addressOptions = this.form.address.split('~')
                this.editVisible = true;
            },
            handleInsert(){
                this.form={}
                this.insertVisible = true;

            },
            // 保存编辑
            saveEdit() {
                // this.form.address = this.form.addressOptions.join('~')
                // this.form.addressOptions=[]
                updatePile(this.form).then(ref => {
                    if(ref.code!=100){
                        this.$message.error(ref.msg)
                    }else{
                        this.$message.success(`修改成功`);
                        this.$set(this.queryData.list, this.idx, this.form);
                        this.editVisible = false;
                    }
                })

            },
            //保存新增
            saveInsert(){
                this.form.address = this.form.addressOptions[this.form.addressOptions.length-1].split('-')[1];
                this.form.addressOptions=[]
                console.log("xinzeng "+this.form.address )
                insertPile(this.form).then(ref=>{
                    if(ref.code!=100){
                        this.$message.error(ref.msg)
                    }else{
                        this.$message.success(`新增成功`);
                        this.getData()
                        this.insertVisible = false;
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
                var temp = this.form.createTime;
                this.form={};
               this.form.createTime=temp;


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
        color: #34B458;
    }
</style>
