<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-rank"></i> 拖拽组件</el-breadcrumb-item>
                <el-breadcrumb-item>拖拽排序</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">


                <el-col span="7" class="drag-box-item item-left">
                    <el-autocomplete
                            class="inline-input"
                            v-model="searchUser"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            :trigger-on-focus="false"
                            @select="handleSelect"
                            suffix-icon="el-icon-search"
                            style="position: absolute;top: 0px;width: 100%;background-color: #26292E"
                    ></el-autocomplete>
                    <ul>
                        <li v-for="item,index in managerList">
                            {{item.name}}
                        </li>
                    </ul>
                </el-col>
                <el-col span="15" class="drag-box-item">
                    <div class="item-title item-right">doing</div>
                </el-col>

        </div>
    </section>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: 'draglist',
        data() {
            return {
                managerList:[
                    {uid:12312,name:'到文档'}
                ]
            }
        },
        components:{
        },
        methods: {

        }
    }

</script>

<style scoped>
    .container{
        background-color: #ffffff;
        height: 600px;
    }
    .drag-box-item {
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-left{
        position: relative;
        height: 540px;
        background-color: #eff1f5;
    }
    .item-right{
        height: 200px;
        background-color: #eff1f5;
    }
    .item-left ul{
        width: 100%;
        height: 94%;
        position: absolute;
        top: 6%;
        background-color: white;
        list-style:none;
    }
    .item-left ul li{
        border-bottom: solid 1px #eff1f5;
        height: 60px;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }

</style>
