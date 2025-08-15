// pages/info/info.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showManual: false,
        showLog: false,

    },

    vibrationRespond() {
        wx.vibrateShort({
            type: 'light',
        })
    },

    copyGropId() {
        wx.setClipboardData({
            data: '866190222',
            success() {
                wx.showToast({
                    title: "已复制到剪贴板",
                    icon: 'success',
                    duration: 1500
                });
            },
            fail(err) {
                console.error('复制失败', err); // 错误处理
            }
        });
    },

    showManual() {
        this.setData(
            {showManual: true}
        )
    },

    closeManual() {
        this.setData(
            {showManual: false}
        )
    },

    showLog() {
        this.setData(
            {showLog: true}
        )
    },

    closeLog() {
        this.setData(
            {showLog: false}
        )
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

}
})