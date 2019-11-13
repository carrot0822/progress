let setting = [
    {
        url:""
    }
]
Page({
    data: {

    },
    // 更多资料
    toMyInfo(){
        wx.navigateTo({
            url:"../userMode/myInfo/myInfo",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    // 路由跳转
    toCollect(){
        wx.navigateTo({
            url:"/pages/userMode/collect/collect",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    toBorRet(){
        wx.navigateTo({
            url:"../userMode/borRet/borRet",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    toReaderCard(){
        
        wx.navigateTo({
            url:"../userMode/readerCard/readerCard",
            events:{

            },
            success(){
                console.log('调换成功')
            }
        })
    },
    toUnbind(){
        wx.navigateTo({
            url:"../userMode/unBindCard/unBindCard",
        })
    },
    toBill(){
        wx.navigateTo({
            url:"../userMode/bill/bill",
        })
    },
    toAboutUs(){
        wx.navigateTo({
            url:"../userMode/about/about",
        })
    },
    toSuggestion(){
        wx.navigateTo({
            url:"../userMode/suggestion/suggestion",
        })
    }
    /**
     * 判定是否绑定看读者卡 flag 绑定了就不跳转
     */

})