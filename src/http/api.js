const libSelect = require('./search/libSelect')
let index = {
    hot:'wxxcxmodule/query/getBorrowHost', // 热门借阅
    recommend:'wxxcxmodule/query/getRandBookByPlace', // 推荐书籍
    newBook:'wxxcxmodule/query/getNewBook', // 新书
    detail:'wxxcxmodule/query/getBopCataOne', // 馆藏详情
    posList:'wxxcxmodule/query/getBopCollectionPage', // 位置信息
    search:'wxxcxmodule/query/select', // 任意词搜索
    login:"wxxcxmodule/index/wxlogin", // 登录
    bindCard:"wxxcxmodule/index/cardlogin" // 绑定卡片
}
const Api = {
    index,
    libSelect
}

module.exports = Api