Page({
    data:{
        inputMode:{
            inputValue:"",
            inputFocus:true
        },
        searchHis:['社会心理学','但是说不清','测试应该够了','再来几条','有丶无聊啊'],
        clearShow:true,
        page:1,
        height:0
    },

    // 事件触发函数
    toIndex(){
        console.log("??")
        wx.switchTab({
            url: '../../index/index'
          })
    },
    watchInput(event){
        console.log('输入的话',event.detail)
    },
    searchHis(event){
        console.log(event)
    },
    search(event){
        console.log(event.detail,'点击搜索的话')
    },
    // api
    //数据过滤函数
    // 生命周期函数
    //钩子函数
    toBottom(){
        var that = this
        let page = this.data.page + 1
        let testArr = ['1111','2222','3333','4444']
        let data = this.data.searchHis.concat(testArr)
        that.setData({
            page:page,
            searchHis:data
        })
        console.log("已经到底了",this.data.page)
    },
    onLoad(){
        let that = this
        console.log("???")
        wx.getSystemInfo({
            success (res) {
              let multiple = 750 / res.windowWidth
              let height =Math.floor(multiple * res.windowHeight) - 33;
              that.setData({
                  height:height + 'rpx'
              })
              console.log(that.data.height,'比较后高度')
              console.log(res.model)
              console.log(res.pixelRatio)
              console.log(res.windowWidth)
              console.log(res.windowHeight)
              console.log(res.language)
              console.log(res.version)
              console.log(res.platform)
            }
          })
    },
    
    onReachBottom(){
        var that = this
        let page = this.data.page + 1
        let testArr = ['1111','2222','3333','4444']
        let data = this.data.searchHis.concat(testArr)
        that.setData({
            page:page,
            searchHis:data
        })
        console.log("已经到底了",this.data.page)
    }
})