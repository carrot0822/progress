Page({
    data: {
        value: ''
    },
    input(event) {
        this.value = event.detail.value
        console.log(event.detail.value)
    },
    submit() {
        let value = this.value
        console.log(value, '过不去？')
        if (value) {
            this.setData({
                value: ''
            })
            this.value = ''
            setTimeout(() => {
                wx.showToast({
                    title: '反馈提交成功',
                    icon: 'success',
                    duration: 2000,
                    success() {

                    }
                })

            })
        } else {
            wx.showToast({
                title: '请填写意见',
                icon: 'none',
                duration: 2000,
                success() {

                }
            })
        }

    }
})