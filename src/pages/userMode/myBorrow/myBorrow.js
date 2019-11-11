//logs.js


Page({
  data: {
    
  },
  // 事件
  renewBtn(e){
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    console.log(e)
  }
})
