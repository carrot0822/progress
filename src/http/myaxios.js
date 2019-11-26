// 还是需呀一个加载中的判定
let myAxios = function (url, data, method) {
    let token = wx.getStorageSync('token');
    let promise = new Promise((resolve, reject) => {
        wx.showLoading({
            title:'加载中'
        })
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json',
                "Authorization": token,
            },
            method: method || 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {

                let res = result.data
                if (res.code == 3001 || res.code == 3003) {
                   // wx.setStorageSync('token', '') // 置空token
                    // 重定向到绑卡页面
                    wx.showModal({
                        title: res.msg,
                        content: '点击确认前往绑定图书卡',
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.navigateTo({
                                    url: '/pages/bindCard/bindCard',
                                    success: (result) => {

                                    },
                                    fail: () => {},
                                    complete: () => {}
                                });
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    console.log('奇怪')
                    resolve(res)
                }

            },
            fail: (e = {
                code: -1,
                msg: errMsg,
                errMsg
            }) => {
                let msg = e.errMsg;
                if (e.errMsg == 'request:fail time out') {
                    msg = '服务请求超时,请稍后重试'
                }
                wx.showToast({
                    title: msg,
                    icon: 'none'
                });
                reject(e);
                console.log('报错的话')
            },
            complete: () => {
                wx.hideLoading()
            }
        });
    })
    return promise
}
module.exports = myAxios