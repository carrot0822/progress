//logs.js


Page({
    toMail() {
        wx.navigateTo({
            url:"../../userMode/reviseMail/reviseMail"
        })
    },
    toPhone(){
        wx.navigateTo({
            url:"../../userMode/revisePhone/revisePhone"
        })
        
    }
})