// pages/focus/focus.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        slider_x: 0,
    },

    onSliderEnd() {
        if (this.data.slider_x > 220) {
            console.log("拖动成功，在此处添加开启专注的逻辑")
        }

        this.setData({
            slider_x : 0
        })
    },

    onSliderChange(event: WechatMiniprogram.MovableViewChange) {
        this.data.slider_x = event.detail.x;
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