<template>
    <div id="app">
<!--        <p>mqtt收到的数据：</p>-->
<!--        <p>{{this.msg}}</p>-->
        <el-row style="width: 100%">
            <el-row :gutter="20"  style="width: 60%;margin-left: 3%">

                <el-col :span="12">
                    <div class="bg-purple-dark1 left-box">
                        <img src="../../assets/img/Erweibanma.png" class="user-avator" width="70%" style="border-radius: 10px;margin-left: 15%;margin-right: 15%;margin-top: 10px" alt />
                        <el-row style="width: 100%;background-color: #ffffff;height: 60px;border-bottom:#CCCCCC 1px solid; ">
                            <el-col :span="8" align="center" style="line-height: 60px">
                                <div class="border-right">
                                    接通插头
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div style="width: 100%" align="center">
                                    <el-switch
                                            v-model="plug_in"
                                            active-text="接通"
                                            style="height: 60px"
                                            @change=plugChange($event)
                                            inactive-text="断开">
                                    </el-switch>
                                </div>

                            </el-col>
                        </el-row>

                        <el-row style="width: 100%;background-color: #ffffff;height: 60px;border-bottom:#CCCCCC 1px solid; ">
                            <el-col :span="8" align="center" style="line-height: 60px">
                                <div class="border-right">
                                    接通电源
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div style="width: 100%" align="center">
                                    <el-switch
                                            v-model="start_charge"
                                            active-text="开"
                                            style="height: 60px"
                                            @change=startCharge($event)
                                            inactive-text="关">
                                    </el-switch>
                                </div>

                            </el-col>
                        </el-row>

                        <el-row style="width: 100%;background-color: #ffffff;height: 180px;border-bottom:#CCCCCC 1px solid; ">
                            <el-col :span="8" align="center" style="line-height: 180px">
                                <div class="border-right">
                                    发送数据
                                </div>
                            </el-col>
                            <el-col :span="16" align="center">
                                <div class="send-input">
                                    电流：
                                    <el-input
                                            style="width: 60%"
                                            size="mini"
                                            v-model="send_electricity">
                                    </el-input>
                                    A
                                </div>
                                <div class="send-input">
                                    电压：
                                    <el-input
                                            style="width: 60%"
                                            size="mini"
                                            v-model="send_voltage">
                                    </el-input>
                                    V
                                </div>
                                <div class="send-input">
                                    进程：
                                    <el-input
                                            style="width: 60%"
                                            size="mini"
                                            v-model="send_process">
                                    </el-input>
                                    %
                                </div>
                                <div class="send-input">
                                    剩余时间：
                                    <el-input
                                            style="width: 50%"
                                            size="mini"
                                            v-model="send_lasttime">
                                    </el-input>
                                    时
                                </div>

                                <el-button style="margin-top: 16px;width: 120px" type="primary" @click="handleSend" round>发送</el-button>
                            </el-col>
                        </el-row>
                        <el-row style="width: 100%;background-color: #ffffff;height: 60px;border-bottom:#CCCCCC 1px solid; ">
                            <el-col :span="8" align="center" style="line-height: 60px">
                                <div class="border-right">
                                    结束充电
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div style="width: 100%" align="center">
                                    <el-button style="margin-top: 16px;width: 120px" type="danger" @click="handleFinish" round>结束充电</el-button>
                                </div>

                            </el-col>
                        </el-row>



                    </div></el-col>
                <el-col :span="12">
                    <div class="bg-purple1 right-box">
                        <div class="info-item" align="center">
                            <el-table
                                    :show-header="false"
                                    border
                                    size="max"
                                    :data="tableData">
                                <el-table-column prop="key" width="150px"  align="center">
                                </el-table-column>
                                <el-table-column prop="value"  align="center"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-row>



    </div>
</template>

<script>

    import mqtt from 'mqtt'

    var client
    const options = {
        connectTimeout: 40000,
        clientId: 'Web',
        username: 'admin',
        password: 'public',
        clean: true
    }
    client = mqtt.connect('ws://39.97.99.126:8083/mqtt', options)
    export default {
        data() {
            return {
                msg: '--',
                tableData:[
                    {key:'编号',value:'获取中'},
                    {key:'状态',value:'获取中'},
                    {key:'类型',value:'获取中'},
                    {key:'地址',value:'获取中'},
                    {key:'电流',value:'获取中'},
                    {key:'电压',value:'获取中'},
                    {key:'充电进程',value:'获取中'},
                    {key:'剩余时间',value:'获取中'},
                ],
                plug_in:false,
                start_charge:false,
                send_electricity:'',
                send_voltage:'',
                send_process:'',
                send_lasttime:'',
                pid:'20200030',

            }
        },

        created() {
            this.mqttMsg();
            client.publish('topic1', 'connect~'+this.pid)
        },

        methods: {
            mqttMsg() {
                client.on('connect', (e) => {
                    console.log("连接成功！！！")
                    client.subscribe('topic2', { qos: 0 }, (error) => {
                        if (!error) {
                            console.log('订阅成功')
                        } else {
                            console.log('订阅失败')
                        }
                    })

                })
                // 接收消息处理
                client.on('message', (topic, message) => {
                    console.log('收到来自', topic, '的消息', message.toString())
                    var msg = JSON.parse(message.toString());
                    var status = msg.status === '0' ? '空闲' : msg.status === '1' ? '使用中' : msg.status === '2' ? '被预约': msg.status === '3' ? '待维修' : '';
                    var type = msg.type === '0' ? '直流' : msg.type === '1' ? '交流' : msg.type === '2' ? '混合电流':'';

                    this.tableData = [
                        {key:'编号',value:msg.id},
                        {key:'状态',value:status},
                        {key:'类型',value:type},
                        {key:'地址',value:msg.reserve1},
                        {key:'电流',value:msg.electricity+'A'},
                        {key:'电压',value:msg.voltage+'V'},
                        {key:'充电进程',value:msg.reserve2.split("~")[2]+'%'},
                        {key:'剩余时间',value:msg.reserve2.split("~")[3]+"时"},
                    ]
                    this.plug_in = msg.reserve2.split("~")[0]=== '1'?true:false;
                    this.start_charge = msg.reserve2.split("~")[1]=== '1'?true:false;
                    this.send_electricity=msg.electricity;
                    this.send_voltage=msg.voltage;
                    this.send_process=msg.reserve2.split("~")[2];
                    this.send_lasttime=msg.reserve2.split("~")[3];

                })
                //发送数据处理

            },
            plugChange(res){
                var temp;
                if(res){
                    temp=1;
                }else{
                    temp=0
                }
                // temp =1?0:res==true;
                client.publish('topic1', '0~'+this.pid+'~'+temp);
                console.log("更新插头信息"+temp);

            },
            startCharge(res){
                var temp;
                if(res){
                    temp=1;
                }else{
                    temp=0
                }
                client.publish('topic1', '1~'+this.pid+'~'+temp);
                console.log("电源信息"+temp);
            },
            handleSend(){
                client.publish('topic1', '2~'+this.pid+'~'+this.send_electricity+"-"+this.send_voltage+"-"+this.send_process+"-"+this.send_lasttime+"-");
                console.log('电流：'+this.send_electricity+'电压'+this.send_voltage+'充电进程'+this.send_process+'剩余时间：'+this.send_lasttime)
            },
            handleFinish(){
                client.publish('topic1', '3~'+this.pid);
                console.log("finish charge")
            }
        }


    }
</script>
<style>
    .bg-purple-dark1 {
        background: #99a9bf;
    }
    .bg-purple1 {
        background: #d3dce6;
    }
    .left-box{
        height: 550px;
    }
    .right-box{
        height: 280px;
    }
    .info-item{
        width: 100%;
    }
    .border-right{
        border-right: #CCCCCC 1px solid;
    }
    .send-input{
        font-size: 14px;
        width: 90%;
        margin-left: 5%;
        margin-top: 10px;
        height: 20px;
    }
</style>
