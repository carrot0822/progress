let Router = require('../utils/Router')
let Store = require('../utils/Store')
let Env_config = require('./index')
function shake(App) {
    console.log('摇摆监控')
    var numX = 1 
    var numY = 1
    var numZ = 0
    var stsw = true // 开关 节流 限定一定的时间内只能一次
    var positiveNum = 0 // 正数 摇一摇总数
    wx.onAccelerometerChange((res) => {
        
        if(numX<res.x && numY < res.y){
            positiveNum ++
            // 2s内没有摇到指定次数就重新计算
            setTimeout(()=>{
                positiveNum = 0
            },2000) 
            console.log(res,'摇一摇Aapi',positiveNum)
        }
        if(numZ<res.z && numY < res.y){
            positiveNum ++
            setTimeout(()=>{
                positiveNum = 0
            },2000) 
            console.log(res,'摇一摇Aapi',positiveNum)
        }
        if(positiveNum == 2 && stsw){
            stsw = false
            // 振动API
            wx.vibrateLong({
                success: (result)=>{
                    
                },
                fail: ()=>{},
                complete: ()=>{}
            });
            // 弹框选择
            wx.showModal({
                title: '摇一摇切环境',
                content: '选择环境',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                    if(result.confirm){
                        wx.showActionSheet({
                            itemList: ['Dev','Test','Test2','Slave'],
                            itemColor: '#000000',
                            success: ({tapIndex})=>{
                                console.log(tapIndex,'摇摆数据')
                                changeEnv(tapIndex)
                            },
                            fail: ()=>{},
                            complete: ()=>{}
                        });
                    } else if(res.cancel){

                    }
                },
                fail: ()=>{},
                complete: ()=>{}
            });
            console.log('摇一摇成功')
            setTimeout(()=>{
                positiveNum = 0
                stsw = true
            },2000)
        }
    });
}

function changeEnv (index){
    // 根据传递的值进行切换环境
    let env = ['Dev','Test','Test2','Slave']
    App.config = Env_config[env[index]]
    App.config.env = env[index]
    Store.clear() // 清除所有信息
    Router.push({path:'index'}) // 返回首页 然后重新登录授权
    console.log(App.config,'就很怪 很难成功啊')
}

module.exports = {
    shake
}