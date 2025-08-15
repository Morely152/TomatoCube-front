// pages/personal/personal.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showCode: false,
        inputCode: '',
        showVIP: false,
        showCancel: false,
    },

    showCode() {
        this.setData(
            { showCode: true }
        )
    },


    closeCode() {
        this.setData({
            showCode: false,
            inputCode: ''
        });
    },

    onInputCode(e: any) {
        this.setData({
            inputCode: e.detail.value
        });
    },

    verifyCode() {
        const correctCode = 'code123';
        const inputCode = this.data.inputCode.trim();

        if (inputCode === correctCode) {
            wx.showToast({
                title: '激活成功',
                icon: 'success',
                duration: 2000
            });
            this.closeCode();
        } else {
            wx.showToast({
                title: '激活码不正确或已经被使用',
                icon: 'none',
                duration: 2000
            });
            this.setData({
                inputCode: ''
            });
        }
    },

    showVIP() {
        this.setData(
            { showVIP: true }
        )
    },


    closeVIP() {
        this.setData(
            { showVIP: false, }
        );
    },

    showAd16() {
        // 播放16s广告
        wx.showToast({
            title: '开发中，敬请期待…',
            icon: 'none',
            duration: 2000
        })
    },

    showAd30() {
        // 播放30s广告
        wx.showToast({
            title: '开发中，敬请期待…',
            icon: 'none',
            duration: 2000
        })
    },

    feedBack() {
        wx.setClipboardData({
            data: '866190222',
            success() {
                wx.showToast({
                    title: "已复制QQ群号,请前往交流群反馈意见和建议。",
                    icon: "none",
                    duration: 2000,
                })
            },
            fail(err) {
                console.error('复制失败', err); // 错误处理
            }
        });
    },
    
    showCancel() {
        this.setData(
            {showCancel: true}
        )
    },

    closeCancel() {
        this.setData(
            {showCancel: false}
        )
    },

    confirmCancel() {
        // 注销账号逻辑
    },
    
    logOut() {
        // 退出登录逻辑
    },

    // 点击导航栏跳转到此页面时
    onTabItemTap() {
        wx.vibrateShort({ type: 'heavy' });
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

    },

    goToSettings() {
        wx.navigateTo({
            url: '../settings/settings'
        })
    },

    goToInfo() {
        wx.navigateTo({
            url: '../info/info'
        })
    },
})