// pages/focus/focus.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        slider_x: 0,
        btn_x: 0,
        btn_y: 0,
        buttonPosition: { left: 107.5 + 107.5 * Math.sin(Math.PI/6*5) - 20, top: 107.5 - 107.5 * Math.cos(Math.PI/6*5) - 20 }, // 初始位置（60°）
        currentTime: {
            main: "00:25",  // 主时间部分（时:分）
            seconds: "00"   // 秒数部分
        },
        lastAngle: Math.PI/3, // 初始角度（60°）
        totalDiff: 5 * Math.PI / 6, // 初始累计角度（25分钟对应的弧度）
        lastDisplayedMinutes: 25, // 记录上次显示的时间(分钟)
    },

    // 松开滑动开关
    onSliderEnd() {
        if (this.data.slider_x > 220) {
            console.log("拖动成功，在此处添加开启专注的逻辑")
        }

        this.setData({
            slider_x: 0
        })
    },

    // 滑动开关时
    onSliderChange(event: WechatMiniprogram.MovableViewChange) {
        this.data.slider_x = event.detail.x;
    },

    // 拖动进度条按钮时
    onDragPgb(event: WechatMiniprogram.TouchEvent) {
        const query = wx.createSelectorQuery();
        query.select('.track').boundingClientRect((res) => {
            const centerX = res.left + res.width / 2;
            const centerY = res.top + res.height / 2;
            const touchX = event.touches[0].clientX - centerX;
            const touchY = event.touches[0].clientY - centerY;
            
            // 计算当前角度（弧度）
            const currentAngle = Math.atan2(touchY, touchX);
            
            // 固定半径
            const radius = 107.5;
            const targetX = centerX + radius * Math.cos(currentAngle);
            const targetY = centerY + radius * Math.sin(currentAngle);
            
            this.setData({
                buttonPosition: {
                    left: targetX - res.left - 20,
                    top: targetY - res.top - 20,
                }
            });
            
            this.updateTime(currentAngle);
        }).exec();
    },
    
    updateTime(currentAngle: number) {
        const { lastAngle, totalDiff, lastDisplayedMinutes } = this.data;
        let angleDiff = currentAngle - lastAngle;
        
        // 处理角度跳变（跨过Math.PI边界）
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        const newTotalDiff = totalDiff + angleDiff;
        
        // 时间计算（每2π弧度=60分钟，步长5分钟）
        const minutesPerCircle = 60;
        const step = 5;
        const totalMinutes = Math.round(newTotalDiff / (Math.PI / 6)) * step;
        
        // 限制时间范围（0-120分钟）
        const clampedMinutes = Math.max(0, Math.min(120, totalMinutes));
        
        // 只有当分钟数变化时才更新显示和振动
        if (clampedMinutes !== lastDisplayedMinutes) {
            const hours = Math.floor(clampedMinutes / 60);
            const mins = clampedMinutes % 60;
            
            // 触发振动
            wx.vibrateShort({ type: 'heavy' });
            
            this.setData({
                currentTime: {
                    main: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
                    seconds: "00"
                },
                lastDisplayedMinutes: clampedMinutes,
                lastAngle: currentAngle,
                totalDiff: newTotalDiff,
            });
        } else {
            // 分钟数没变化时只更新角度数据
            this.setData({
                lastAngle: currentAngle,
                totalDiff: newTotalDiff,
            });
        }
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