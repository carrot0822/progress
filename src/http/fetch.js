const errMsg = '服务异常，请稍后重试';
/*
@loading 请求时是否需要展示loading
@toast 请求错误展示的toast 提示信息  这两个还没封装过
@mode 模式？
@ismock 是否开启了mock
*/
const fetch = function ({
    loading = true,
    toast = true,
    mode,
    isMock,
    url,
    data,
    method
}) {
    // 自定义参数 token放在这
    const clientInfo = {
        user_id: 1
    }
    // 日志埋点？ 不需要出现loading
    if (loading && mode != 'log') {
        Util.showLoading(); //  这你妈又是哪里引的
    }
    let promise = new Promise((resolve, reject) => {
        /*
         isMock 设置单个接口mock开启
         mode 针对不同业务接口进行处理？ log表示本地埋点上传？        
        */
        if (isMock && mode != 'log') {
            env = App.config.mockApi; // 提前配置的环境
        };
        wx.request({
            url: env + url,
            data: data,
            method: 'get' || method,
            header: {
                'content-type': 'application/json',
                'Server-Token':'xxxxxx',
                "clientInfo":JSON.stringify(clientInfo)
            },

            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                // 日志上传不需要处理结果  日志埋点...
                if(mode == 'log') return
                let res = result.data
                // 登录失败的拦截 直接挂载在外面 拦截器封装
                if(res.code ==1){
                   wx.showToast({
                       title: '当前登录失效， 请重新登录',
                       icon: 'none',
                       image: '',
                       duration: 1500,
                       mask: true,
                       success: (result)=>{
                           
                       },
                       fail: ()=>{},
                       complete: ()=>{}
                   }); 
                }
                // 内部统一的成功code码拦截
                if(res.code ===0){
                    if(loading){
                        wx.hideLoading();
                    }
                    resolve(res)
                } else {
                    // 有些特殊情况不需要toast 需要弹窗 请求失败的情况
                    if(toast){
                        wx.showToast({
                            title:res.msg || errMsg,
                            icon:'none'
                        });
                    }else {
                        wx.hideLoading();
                    }
                    // 返回错误提示信息
                    reject(res)
                }
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
            complete: () => {}
        });
    })
    return promise;
}

module.exports = {
    fetch
}