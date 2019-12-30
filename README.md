### 部署步骤
0. 请确保本地有Node环境(尚未确定自己的Node环境) 和gulp环境(npm install --global gulp-cli)
1. git clone 项目在本地文件
2. cd 到文件内使用 npm install 安装镜像 注意提前安装Node环境
3. 输入命令 gulp 进行复制编译src中的各项文件生成dist 并会启动热更新
4. 使用微信开发者工具打开dist文件即可 
5. 如果需要上线 则使用自己的appID登录(appID在微信开放平台中获取) 使用微信开发者工具右上角上传即可上传到相应的测试版本


### 功能简介
+ 核心的任意词查询功能 
+ 热门借阅 新书速递 推荐书籍 活动资讯
+ 登录鉴权与绑卡
+ 个人中心各项功能的查询 数字读者证的生成

未实现
+ 扫一扫登录(扫码打开对应的小程序到指定页面根据用户是否绑卡引导用户做后续操作)
+ 邮箱与手机号码的更改(60sCd)
### 目录结构

### 目录介绍
1. assets：放置各类静态资源 主要是图片类资源的 例如indexIcon之类的放置
2. component：非业务组件放置的地方
    + loading组件×
    + 弹框组件√
    + tab滑动选项卡×
    + 吸顶/置底组件×
    + 上拉加载与下拉刷新组件 ×
3. env: 放置webpack打包环境 配置文件暂时未使用
4. http: API与自定义请求放置
5. pages：页面
6. scss：特殊的需要过scss编译器的通用scss文件
7. utlis: 通用函数 
    + Router对象的封装
    + Store对象的封装
    + 非业务函数
8. wxParse：使用wxParse的富文本转义组件


99. gulpfile.js 具体运行配置文件 内有注释

### 注意事项
+ 如果gulp运行的时候出现scss文件等找不到 可以输入gulp clean 再输入gulp命令行
+ 如果运行出现登录error失误 请检查自己的appID与后端的appID appSelect一致 由于接口设置问题导致这块需要前后端确认 如果要修改可以更改 API中的login接口使用方式 由前端传递appId和 appSelect
+ 以后编写前 还是先确定自己的编译环境 Node环境 webpack环境
### 莫名的机型Bug
+ 如果不使用自定义tabbar 安卓的title是靠右 ios则是居中
#### 安卓
 1. 对于getCurrentPage获取的页面栈执行reload函数强制刷新页面的支持并不是很好 修复方法为在onShow函数内设置对应的变量来进行特定的刷新


 #### Ios
1. ios输入删除偶尔会清除掉所有输入值


### 值得借鉴和移植到移动端的地方

#### 组件使用率
1. 表单组件
2. 轮播组件 -- 图片点击放大 长按保存
3. scroll 滚动组件 拥有触发事件 下拉刷新上拉加载 监听
4. 交互类组件 信息提示组件 弹框选择组件
#### 函数对象封装
1. 请求拦截器的封装 封装为promise和asysn结构
2. 数据过滤函数 包括数据校检和日期格式转换
3. 