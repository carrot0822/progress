
let myAxios = function(url,data,method){
    let promise = new Promise((resolve, reject) => {
         wx.request({
            url: url,
            data: data,
            header: {'content-type':'application/json'},
            method: method,
            dataType: 'json',
            responseType: 'text',
            success: (result)=>{
                let res = result.data
                resolve(res)
            },
            fail: (e={code:-1,msg:errMsg,errMsg}) => {
                let msg =e.errMsg;
                if(e.errMsg == 'request:fail time out'){
                    msg = '服务请求超时,请稍后重试'
                }
                wx.showToast({
                    title:msg,
                    icon:'none'
                });
                reject(e);
            },
            complete: ()=>{}
        });
    })
    return promise
}
module.exports = myAxios

