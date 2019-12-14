const libSelect = require('./search/libSelect')
let index = {
    banner:'wxxcxmodule/query/getAdvertisement', // 轮播广告
    activeList:'wxxcxmodule/query/selectNotice',// 活动资讯
    article:"wxxcxmodule/query/selectOneNotice", // 文章详情
    hot:'wxxcxmodule/query/getBorrowHost', // 热门借阅
    recommend:'wxxcxmodule/query/getRandBookByPlace', // 推荐书籍
    newBook:'wxxcxmodule/query/getNewBook', // 新书
    detail:'wxxcxmodule/query/getBopCataOne', // 馆藏详情
    posList:'wxxcxmodule/query/getBopCollectionPage', // 位置信息
    search:'wxxcxmodule/query/select', // 任意词搜索
    login:"wxxcxmodule/index/wxlogin", // 登录
    bindCard:"wxxcxmodule/index/cardlogin", // 绑定卡片
    unBind:"wxxcxmodule/index/relieveBing" ,// 解除绑定
    getUser:'wxxcxmodule/readerInfo/select', // 获取用户信息
    barCode:'wxxcxmodule/query/getBarCode', // 条形码
    qrCode:'wxxcxmodule/query/getQrCode',// 二维码
    bill:"wxxcxmodule/readerInfo/selectFinance", // 我的账单
    broHis:"wxxcxmodule/reader/his/getReaderLog", // 借阅历史
    myBro:"wxxcxmodule/reader/renew/getReaderLog", // 我的借阅
    renew:"wxxcxmodule/reader/renew/renewBooks", // 续借
    numbers:"wxxcxmodule/reader/renew/getLogAndHis", // 借阅数量和历史数量
    collect:"wxxcxmodule/SfrTbCollect/getSfrTbCollects", // 收藏查询
    aboutUs:'wxxcxmodule/query/selectaboutus', // 关于我们
    // 收藏相关
    cancelCollect:"wxxcxmodule/SfrTbCollect/deleteSfrTbCollectByBook",// 取消收藏
    addCollect:"wxxcxmodule/SfrTbCollect/addSfrTbCollect", // 添加收藏
    isCollect:"wxxcxmodule/SfrTbCollect/checkCollect", // 是否收藏
    batchCancel:"wxxcxmodule/SfrTbCollect/deleteSfrTbCollect" // 批量删除收藏
}
const Api = {
    index,
    libSelect
}

module.exports = Api