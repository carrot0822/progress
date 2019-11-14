

Page({
  data:{
      list:['1','2','3','4','5']
  },
  toDetail(){
    wx.navigateTo({
        url:"../billDetail/billDetail",
        events:{

        },
        success(){
            console.log('调换成功')
        }
    })
  }
})
