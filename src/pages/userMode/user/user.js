//logs.js


Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    // 查看是否授权
    wx.getSetting({
      success (res){
        console.log(res,'这个是啥')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        } else{
          wx.authorize({
            scope: '',
            success: (result)=>{
              
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        }
      }
    })

    wx.request({
      url: 'http://192.168.2.29:8088//authmodule/sysSet/currency/select',
      data: {},
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log(result,'接口调用')
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  bindGetUserInfo (e) {
    console.log(e)
    console.log(e.detail.userInfo)
  }
})
