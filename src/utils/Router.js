
const routerPath = {
     index:"/pages/index/index", // 首页
     searchInput:"/pages/searchMode/searchInput/searchInput", // 搜索
     libSelect:"/pages/searchMode/libSelect/libSelect", // 馆藏地选择
     activity:"/pages/searchMode/activity/activity", // 活动资讯
     article:"pages/searchMode/article/article", // 活动详情
     hotRecommend:"/pages/searchMode/hotRecommend/hotRecommend", // 热门详情
     
     personal:"/pages/personal/personal", // 个人中心
     collect:"pages/userMode/collect/collect", // 我的收藏
     borRetL:"pages/userMode/borRet/borRet", // 我的借还
     readerCard:"pages/userMode/readerCard/readerCard", // 数字读者证
     unbindCard:"pages/userMode/unBindCard/unBindCard",// 解绑读者卡
     bill:"pages/userMode/bill/bill", // 我的账单
     billDetail:"pages/userMode/billDetail/billDetail", // 账单详情
     about:"pages/userMode/about/about", // 关于我们
     suggestion:"pages/userMode/suggestion/suggestion", // 意见反馈
     borrow:"pages/userMode/myBorrow/myBorrow", // 我的借阅
     borrowHis:"pages/userMode/borrowHis/borrowHis", // 借阅历史
     myInfo:"pages/userMode/myInfo/myInfo", // 我的信息
     reviseMail:"pages/userMode/reviseMail/reviseMail", // 修改邮件
     revisePhone:"pages/userMode/revisePhone/revisePhone", // 修改 修改手机
}

class Router{
    constructor(){

    }
    /**
     * 将json对象分割为字符串
     * @param {object} data 
     * @return {string}
     */
    parse(data){
        let tempArr = []
        for(let key in data){
            tempArr.push(key + '=' + encodeURIComponent(data[key]))
        }
        return tempArr.join('&')
    }
    /**
     * 传入地址和参数后将会携参跳转 vue router的push
     * @param {string} path 
     * @param {object} option 
     */
    push(path,option = {}){
        if(typeof path == 'string'){
            option.path = path // 监控无参数路径
        } else {
            option = path
        }
        // 匹配key值找到对应的path
        let url = routerPath[option.path] || routerPath["index"]
        // 读取传入的配置c参数
        let {query={}, openType = 'redirect', duration = 0} = option
        // json 转换为字符串拼接参数
        let params = this.parse(query);
        url = url + '?' + params
        // 是否需要延时跳转
        if(duration){
            setTimeout(()=>{
            this.to(openType, url)
            },duration)
        }else{
            this.to(openType, url)
        }
    }
    /**
     * 进行小程序的路由跳转
     * @param {string} openType  
     * @param {obj} url 
     * openType:{
     *  
     * }
     */
    to(openType,url){
        let obj = {url}
        if(openType == 'redirect'){
            wx.redirect(obj) // 页面重定向
        } else if(openType == "reLaunch"){
            wx.reLaunch(obj) // 关闭所有页面 打开到应用内的某个页面
        } else if(openType == 'back'){
            // 关闭当前页面 返回到上一页面或多级页面  getCurrentPage获取当前页面栈
            wx.navigateBack({
                delta: 1
            });
            console.log('当前页面栈', getCurrentPages())
        } else {
            wx.navigateTo(obj)
        }
    }
    
}
let obj = new Router()
module.exports = obj