let setting = [
    {
        url:""
    }
]
Page({
    data: {

    },

    // 路由跳转
    toCollect(){
        wx.navigateTo({
            url:"pages/userMode/user/user",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    /**
     * 判定是否绑定看读者卡 flag 绑定了就不跳转
     */
    toJump(){

    }

})