//logs.js
var WxParse = require('../../wxParse/wxParse');
var myAxios = require("../../http/myaxios")
var url = 'http://192.168.2.29:8091/serviceforreadermodule/readerTbNotice/currency/selectOne'
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    let that = this
    let data = ''
    myAxios(url,{id:'00b2c8b9c4f5f34bfaaf91dc77fe9b6b0d'},'GET').then((res)=>{
      console.log(res.row.content)
      data = res.row.content
      console.log(data,'这个呢')
      WxParse.wxParse("article",'html',data,that,5)
    })


  }
})
