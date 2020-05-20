<template style="background-color: white">
    <el-row>
        <el-row>
            <el-col :span="6" style="margin-left: 100px;">
                <div class="grid-content bg-purple leftBox">
                    <div style="width: 100%;height: 150px;position: relative;border-bottom: solid 1px #f4f4f4;">
                        <el-avatar :size="60" icon="el-icon-user-solid" style="position: absolute;top: 20px;left:10px"></el-avatar>
                        <span style="position: absolute;font-size: 30px;color: white;left:100px;top: 30px;">{{currentMname}}</span>
                        <el-autocomplete
                                class="inline-input"
                                v-model="searchUser"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                :trigger-on-focus="false"
                                @select="handleSelect"
                                suffix-icon="el-icon-search"
                                style="position: absolute;bottom: 10px;left:10%;width: 80%; background-color: #26292E"
                        ></el-autocomplete>
                    </div>
                    <vue-scroll :ops="ops" style="width:100%;height:410px;" >
                        <ul ref="userUl" class="infinite-list" v-loading="userListLoad" >
                            <!--                    v-infinite-scroll="load"-->
                            <li v-for="i,index in userList" :class="{activeLi:index==activeIndex}" class="infinite-list-item "  @click="clickFun(index)">

                                <!--                            <el-button size="small" @click="clickFun(index)">{{i.name}}</el-button>-->
                                <div class="userListItem">
                                    <el-badge :value="i.unreadnum" class="item" :hidden="i.unreadnum==0">
                                        <el-avatar shape="square" :size="40" >{{i.name}}</el-avatar>

                                    </el-badge>
                                    <div class="el-avatar-right" style="">
                                        <div>
                                            <span>{{i.name}}({{i.uid}})</span><br/>
                                            <span style="color: #989898">{{i.leasttime.substr(5)}}</span>
                                        </div>

                                    </div>
                                </div>

                            </li>

                        </ul>
                    </vue-scroll>


                </div></el-col>
            <el-col :span="15" style=" border: #606266 1px solid;"><div class="grid-content bg-purple-light rightBox">
                <div style="overflow: auto;">
                    <el-row>
                        <el-col :span="24">

                            <div
                                    id="dataShow"
                                    onmouseover="this.style.overflow='overlay'"
                                    onmouseout="this.style.overflow='hidden'"
                                    class="dataShow"
                                    ref="dataShow"
                            >
                                <div v-for="(item,index) in radioInfoList"
                                     :key="index"
                                     style="background-color: #f5f5f5; padding:24px;">
                                    <el-row v-if="item.type=='1'">

                                        <el-col :span="20" :offset="3"><span class="aa" @click="messageClick(item.type)">
                                                    {{ item.content }}
                                                  <span v-if="item.reserve1==0"  class="tip_right">未读消息</span>
                                            </span></el-col>

                                        <el-col :span="1">
                                            <el-avatar  shape="square" :size="40" >{{currentMname}}</el-avatar>
                                        </el-col>

                                    </el-row>
                                    <br>
                                    <el-row v-if="item.type=='0'" style="margin-left: -20px">
                                        <el-col :span="1">
                                            <el-avatar  shape="square" :size="40" >{{currentUname}}</el-avatar>
                                        </el-col>
                                        <el-col :span="20">
                                            <span class="bb">
                                                {{ item.content }}
                                             <span v-if="item.reserve1==0" class="tip_left"><el-badge is-dot style="width: 1px;height: 1px"></el-badge></span>
                                            </span>

                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div class="sendBox" style="">
                                <el-input
                                        type="textarea"
                                        placeholder="请输入内容"
                                        v-model="textarea">
                                </el-input>
                                <el-button @click="sendFunc">发送</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div></el-col>
        </el-row>


    </el-row>

</template>
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
<!-- 引入vuescroll-slide -->
<script src="https://unpkg.com/vuescroll/dist/vuescroll-slide.js"></script>
<!-- 引入vuescroll-native -->
<script src="https://unpkg.com/vuescroll/dist/vuescroll-native.js"></script>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/vuescroll/dist/vuescroll.css" />
<script>
    import {getUserList,getMessageByUid,replyMessage,readMessageForManager,selectUserByThink } from '../../api/index';
    import vuescroll from 'vuescroll';
    export default {
        name : 'test',
        components: {
            vuescroll
        },
        data() {
            return {
                websock: null,
                ops: {
                    vuescroll: {

                    },
                    scrollPanel: {
                        speed: 300,

                    },
                    rail: {
                        keepShow:true
                    },
                    bar: {
                        hoverStyle: true,
                        onlyShowBarOnScroll: true, //是否只有滚动的时候才显示滚动条
                        background: '#595C60',
                        size: '3px',
                    },

                },
                userList:[
                ],
                currentUname:'',
                currentMname:'',
                currentMid:'',
                currentUid:'',
                radioInfoList: [],
                visible: false,
                activeIndex:-1,
                searchUser:'',
                userListLoad:false,
                thinkUserList:[],
                textarea:'',
                query:{}
            }
        },
        created() {
            this.initWebSocket();
            this.getMessageUserList();
            this.currentMname = localStorage.getItem("ms_managename")
            this.currentMid = localStorage.getItem("ms_manageid")
        },
        mounted(){
            this.$refs.dataShow.scrollTop=this.$refs.dataShow.scrollHeight;
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        updated(){
            this.$refs.dataShow.scrollTop=this.$refs.dataShow.scrollHeight;
            console.log(this.$refs.dataShow.scrollTop)
        },
        methods: {
            clickFun(index){
                this.userList[index].unreadnum=0;
                this.activeIndex=index;
                this.getMessage(this.userList[index].uid)
                this.currentUname=this.userList[index].name
                this.currentUid=this.userList[index].uid

            },
            querySearch(queryString, cb) {
                var result=[]
                selectUserByThink(queryString).then(ref=>{
                    if(ref.code==100){
                        ref.extend.User.forEach((item,index,array)=>{
                            result.push({value:item.name+'('+item.id+')',id:item.id,name:item.name})
                        })
                    }
                })
                cb(result);
            },
            handleSelect(item){
                console.log(item)
                var index = this.userList.findIndex(function(ref) {
                    return ref.uid == item.id;
                });
                if(index==-1){
                    this.userList.splice(0,0,{uid:item.id,number:0,name:item.name,unreadnum:0,leasttime:new Date().Format("yyyy-MM-dd HH:mm:ss")});
                    this.radioInfoList=[]
                }else{
                    var a = this.userList[index];
                    this.userList.splice(index,1)
                    a.leasttime=new Date().Format("yyyy-MM-dd HH:mm:ss")
                    this.userList.splice(0,0,a)
                    this.getMessage(item.id)
                }
                this.activeIndex=0;
                this.currentUid = item.id
                this.currentUname = item.name


            },
            initWebSocket(){ //初始化weosocket
                const wsuri = "ws://39.97.99.126:8088/imserver/0";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                let info = {"content":"管理端连接成功"};
                this.websocketsend(JSON.stringify(info));
            },
            websocketonerror(){//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                const redata = JSON.parse(e.data);
                console.log(e.data)
                console.log(redata.content)
                this.$message.success(redata.uname+"发来一条消息:"+redata.content);
                console.log(redata.uid)
                var index = this.userList.findIndex(function(item) {
                    return item.uid == redata.uid;
                });
                if(index!=-1){
                    var a = this.userList[index];
                    this.userList.splice(index,1)
                    a.unreadnum+=1
                    a.leasttime=new Date().Format("yyyy-MM-dd HH:mm:ss")
                    this.userList.splice(0,0,a)
                }else{
                    this.userList.splice(0,0,{uid:redata.uid,number:1,name:redata.uname,unreadnum:1,leasttime:new Date().Format("yyyy-MM-dd HH:mm:ss")});
                }

                if(this.currentUid==redata.uid){
                    this.radioInfoList.push(
                        {id:'',uid:this.currentUid,mid:this.currentMid,content:redata.content,time:new Date().Format("yyyy-MM-dd HH:mm:ss"),type:0,reserve1:"0"}
                    )
                }

            },
            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            websocketclose(e){  //关闭
                console.log('断开连接',e);
            },
            getMessageUserList(){
                this.userListLoad=true
                getUserList(this.query).then(res => {
                    this.userList = res.extend.users;
                    this.userListLoad=false
                    console.log(this.userList[0].uid)

                });
            },
            getMessage(uid){
                this.radioInfoList=[]
                getMessageByUid(uid).then(res => {
                    if(res.code==100){
                        this.radioInfoList = res.extend.message;
                    }else{
                        this.radioInfoList=[]
                    }
                    console.log(this.radioInfoList)
                    this.readMessage(uid)
                });
                console.log(this.radioInfoList)
            },
            readMessage(id){
                readMessageForManager({uid:id,mid:this.currentMid});
            },
            sendFunc(){
                if(this.currentUid==''){
                    this.$message.error("请选择用户")
                } else if(this.textarea==''){
                    this.$message.error("消息不能为空")
                }
                else{
                    replyMessage({uid:this.currentUid,mid:this.currentMid,content:this.textarea}).then(res=>{
                        if(res.code==100){
                            this.radioInfoList.push(
                                {id:'',uid:this.currentUid,mid:this.currentMid,content:this.textarea,time:new Date().Format("yyyy-MM-dd HH:mm:ss"),type:1,reserve1:"0"}
                            )
                            this.textarea=''
                        }else{
                            this.$message.error("发送失败，请稍后再试")
                        }
                    })
                }
            }



        },
    }
</script>

<style>
    .font{
        font-size: 16px;
        font-weight: bold;
        font-family: "微软雅黑 Light";
    }
    .dataShow{
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #f5f5f5;
        height:450px;
    }
    .aa{
        float: right;
        position: relative;
        display: inline-block;
        max-width: calc(40%);
        min-height: 35px;
        line-height: 2.1;
        font-size: 15px;
        padding: 6px 10px;
        text-align: left;
        word-break: break-all;
        background-color: #9eea6a;
        color: #000;
        border-radius: 4px;
        box-shadow: 0px 1px 7px -5px #000;
        border:0px solid #000;
        margin-top: 0;
        margin-right: 10px;
    }
    .aa:after {
        content: "";
        border-top: solid 5px #00800000;
        border-left: solid 10px #9eea6a;
        border-right: solid 10px #00800000;
        border-bottom: solid 5px #00800000;
        position: absolute;
        top: 10px;
        left: 100%;
    }
    .bb{
        display: inline-block;
        line-height:30px;
        font-style: normal;
        background-color: white;
        letter-spacing: 2px;
        position: relative;
        max-width: calc(40%);
        min-height: 35px;
        line-height: 2.1;
        font-size: 15px;
        padding: 6px 10px;
        text-align: left;
        word-break: break-all;
        border-radius: 4px;
        color: #000;
        box-shadow: 0px 1px 7px -5px #000;
        border:0px solid #000;
        margin-top: 0;
        margin-left: 20px;
    }
    .bb:after {
        content: "";
        border-top: solid 5px #00800000;
        border-left: solid 10px #00800000;
        border-right: solid 10px white;
        border-bottom: solid 5px #00800000;
        position: absolute;
        top: 10px;
        right: 100%;

    }

    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .leftBox{
        height:560px;
        background-color: #324157;
    }
    .rightBox{
        height:560px;
        background-color: #eeeeee;
    }

    .userListItem{
        width: 100%;
        height: 60px;
    }
    .infinite-list-item :hover{
        background-color: #283446;
    }
    .userListItem .el-badge .el-badge__content {
        margin-top: -3px;
        margin-right: 5px;
        width: 10px;
    }
    .tip_left .el-badge .el-badge__content {
        margin-right: 5px;
        width: 3px;
        height: 3px;
    }
    .el-badge .el-avatar{
        background-color: white;
        color: #1f2f3d;
        margin-left: 5px;
        font-size: 10px;
        margin-top: -10px;
    }
    .el-avatar-right{
        display: inline-block;
        width: 50%;
        color: white;
        margin-left: 20px;
        height: 60px;
    }
    .el-avatar-right div{
        width: 100%;
        height: 50px;
        top: 5px;
    }
    .el-avatar-right div span{
        line-height: 20px;
        font-size: 15px;
        height: 25px;
        margin-top: 0px;
    }
    .tip_right {
        display: block;
        font-size: 12px;
        color: #f0f0f0;
    }
    .tip_left {
        font-size: 12px;
        color: #324157;
        width: 100%;
        text-align: right;
    }
    .activeLi{
        background-color: #283446;
    }
    .sendBox{
        background-color: #00d1b2;
        width: 100%;
        height:110px;
        position:relative;
    }
    .sendBox .el-button{
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
    .sendBox .el-textarea textarea{
        height: 110px;
        background-color: #eeeeee;
    }
</style>