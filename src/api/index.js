import { fetch  }  from '../utils/request';
import axios from "axios"
//用户相关api

export const login = query =>{
    return fetch('/manager/login',{'id' : query.number,'password': query.password})
}
export const getAllUser = query => {
    console.log(query)
    return fetch('/user/getUsers',{'pn' : query.pageIndex,'pz': query.pageSize})
};
export const getUserByName = query => {
    return fetch('/user/getUserByName',{'pn' : query.pageIndex,'pz': query.pageSize,'name': query.searchValue})
};
export const getUserById = query => {
    return fetch('/user/getUserById',{'id': query.searchValue})
};
export const getUserByPhone = query => {
    return fetch('/user/getUserByPhone',{'number': query.searchValue})
};
export const updateUser = form => {
    return fetch('/user/updateUser',form)
};
export const insertUser = form => {
    return fetch('/user/addUser',form)
};
export const deleteUser = id => {
    return fetch('/user/deleteUser',{'id':id})
};
export const selectUserByThink = word => {
    return fetch('/user/selectByThink',{'word':word})
};
export const selectUserByThinkWithPage = query => {
    return fetch('/user/selectByThinkWithPage',{'word':query.searchValue,'pn' : query.pageIndex,'pz': query.pageSize})
};
//充电桩相关api
export const getAllPile = query => {
    console.log(query)
    return fetch('/pile/getPiles',{'pn' : query.pageIndex,'pz': query.pageSize})
};
export const getPileById = query => {
    console.log(query)
    return fetch('/pile/getPileById',{'id':query.searchValue})
};
export const updatePile = form => {
    return fetch('/pile/updatePile',form)
};
export const insertPile = form => {
    return fetch('/pile/addPile',form)
};
export const deletePile = id => {
    return fetch('/pile/deletePile',{'id':id})
};

//订单相关api
export const getAllTrans = query => {
    console.log(query)
    return fetch('/trans/getTrans',{'pn' : query.pageIndex,'pz': query.pageSize})
};
export const getTransSelective= query => {
    console.log(query)
    return fetch('/trans/getTransSelective',
        {
            'serial':query.searchSerial,
            'type': query.searchType,
            'status':query.searchStatus,
            'transDate':query.searchDate,
            'uid':query.searchUid,
            'pid':query.searchPid,
        })
};
export const updateTrans = form => {
    return fetch('/trans/updateTrans',form)
};

export const deleteTrans= serialNo => {
    return fetch('/trans/deleteTrans',{'serial':serialNo})
};

//消息相关api
export const getUserList = query => {
    return fetch('/message/getUnReadUser')
};
export const getMessageByUid= uid => {
    return fetch('/message/getMessageByUid',{'uid':uid})
};
export const replyMessage= query => {
    return fetch('/message/replyMessage',{'uid':query.uid,'mid':query.mid,content:query.content})
};
//使未读消息变已读
export const readMessageForManager= query => {
    return fetch('/message/readMessageForManager',{'uid':query.uid,'mid':query.mid})
};

//员工相关
export const getAllManager = query => {
    console.log(query)
    return fetch('/manager/getAll',{'pn' : query.pageIndex,'pz': query.pageSize})
};
export const selectManagerByThinkWithPage = query => {
    return fetch('/manager/selectByThinkWithPage',{'word':query.searchValue,'pn' : query.pageIndex,'pz': query.pageSize})
};
export const updateManager = form => {
    return fetch('/manager/updateManager',form)
};
export const insertManager = form => {
    return fetch('/manager/addManager',form)
};
export const deleteManager = id => {
    return fetch('/manager/deleteManager',{'id':id})
};

//地址相关
export const getProvince = query => {
    console.log(query)
    return fetch('/position/getProvince')
};

export const getCity = provinceId => {
    console.log(provinceId)
    return fetch('/position/getCity',{'provinceId':provinceId})
};
export const getCounty= cityId => {
    console.log(cityId)
    return fetch('/position/getCounty',{'cityId':cityId})
};
export const getTown = countyId => {
    console.log(countyId)
    return fetch('/position/getTown',{'countyId':countyId})
};