const App = getApp()
let Ip = App.config.baseApi
let Api = App.Api
let axios = App.axios
let Store = App.Store
let Router = App.Router

Page({
    data: {
        barCode: '',
        qrCode: ''
    },

    // 
    _getBarCode(params = {}) {
        let url = Ip + Api.index.barCode
        let data = params
        axios(url, data, 'GET').then((res) => {
            if (res.state) {
                this.setData({
                    barCode: res.row
                })
            }
            console.log(res, '条形码')
        })
    },
    _getQrCode(params = {}) {
        let url = Ip + Api.index.qrCode
        let data = params
        axios(url, data, 'GET').then((res) => {
            if (res.state) {
                this.setData({
                    qrCode: res.row
                })
            }
            console.log(res, '二维码')
        })
    },
    onLoad() {
        this._getBarCode()
        this._getQrCode()
    },
})