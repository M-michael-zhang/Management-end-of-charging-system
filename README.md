# Management-end-of-charging-system
基于vue的充电系统管理端，主要功能包括对用户，管理员，充电桩，订单的管理和与用户的聊天，以及充电桩mqtt命令的模拟
## 项目原地址：https://github.com/lin-xin/vue-manage-system
按照需求对进行修改，包括但不限于：websocket聊天页面，mqtt模拟页面等
# 导航
管理端(web)实现地址: https://github.com/M-michael-zhang/Management-end-of-charging-system  
用户端(Android)实现地址:  https://github.com/M-michael-zhang/Client-of-charging-system
# 实现效果
***页面展示***
![管理端页面](https://raw.githubusercontent.com/M-michael-zhang/Uav-charging-pile-system/master/show/managementPage.gif)
***聊天***
![聊天](https://raw.githubusercontent.com/M-michael-zhang/Uav-charging-pile-system/master/show/chat.gif)
***远程断电***
![远程断电](https://raw.githubusercontent.com/M-michael-zhang/Uav-charging-pile-system/master/show/remotePowerOff.gif)
# 导入流程
* 将项目用webstorm打开，运行后会占用8080端口
* 配置src\utils\request.js，设置为自己的后台的ip和端口
```
import axios from 'axios';
const host = 'http://xxxxxxxx:8088';
```
* 配置MQTT的ip和端口，在src\components\page\Mqtt.vue中，（注意需要开启mqtt代理服务器的websocket服务）
```
 client = mqtt.connect('ws://xxxxxxx:8083/mqtt', options)
```
* 配置聊天服务的WebSocket地址端口，在src\components\page\Tabs.vue中
```
  initWebSocket(){ //初始化weosocket
    const wsuri = "ws://xxxxxxx:8088/imserver/0";
    this.websock = new WebSocket(wsuri);
    this.websock.onmessage = this.websocketonmessage;
    this.websock.onopen = this.websocketonopen;
    this.websock.onerror = this.websocketonerror;
    this.websock.onclose = this.websocketclose;
  },
 ```
