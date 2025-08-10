// pages/focus/focus.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        slider_x: 0,
        btn_x: 0,
        btn_y: 0,
        buttonPosition: { left: 107.5 + 107.5 * Math.sin(Math.PI / 12 * 5) - 15, top: 107.5 - 107.5 * Math.cos(Math.PI / 12 * 5) - 15 },
        currentTime: {
            main: "00:25",
            seconds: "00"
        },
        lastAngle: Math.PI / 12 * (-1),
        totalDiff: 5 * Math.PI / 12 * 5,
        lastDisplayedMinutes: 25,
        canvasContext: null as any, // 存储 Canvas 上下文
        isDragging: false, // 标记是否正在拖动
        maxMinutes: 120, // 最大分钟数
        minMinutes: 0, // 最小分钟数
        is_vibrated: false,
        show_bzy: false,
    },

    // 点击导航栏跳转到此页面时
    onTabItemTap() {
        wx.vibrateShort({ type: 'heavy' });
    },

    // 松开滑动开关
    onSliderEnd() {
        if (this.data.slider_x > 220) {
            console.log("拖动成功，在此处添加开启专注的逻辑")
        }

        this.setData({
            slider_x: 0,
            is_vibrated: false
        })
    },

    // 滑动开关时
    onSliderChange(event: WechatMiniprogram.MovableViewChange) {
        this.data.slider_x = event.detail.x;
        // 到位振动提醒
        if (this.data.slider_x >= 220 && this.data.is_vibrated == false && event.detail.source == "touch") {
            wx.vibrateShort({ type: 'heavy' });
            this.setData({ is_vibrated: true })
        }
    },

    // 拖动进度条按钮时
    onDragPgb(event: WechatMiniprogram.TouchEvent) {
        this.setData({ isDragging: true });

        const query = wx.createSelectorQuery();
        query.select('.track').boundingClientRect((res) => {
            const centerX = res.left + res.width / 2;
            const centerY = res.top + res.height / 2;
            const touchX = event.touches[0].clientX - centerX;
            const touchY = event.touches[0].clientY - centerY;

            // 计算当前角度（弧度）
            let currentAngle = Math.atan2(touchY, touchX);

            // 转换为0-2π范围
            if (currentAngle < -Math.PI / 2) currentAngle += 2 * Math.PI;

            // 计算当前分钟数
            const minutes = this.calculateMinutesFromAngle(currentAngle);

            // 限位判断
            if (minutes <= this.data.minMinutes && currentAngle < -Math.PI / 2 + 0.1) {
                currentAngle = -Math.PI / 2; // 锁定在00:00位置
            } else if (minutes >= this.data.maxMinutes && currentAngle > 3 * Math.PI / 2 - 0.1) {
                currentAngle = 3 * Math.PI / 2; // 锁定在02:00位置
            }

            // 固定半径
            const radius = 107.5;
            const targetX = centerX + radius * Math.cos(currentAngle);
            const targetY = centerY + radius * Math.sin(currentAngle);

            this.setData({
                buttonPosition: {
                    left: targetX - res.left - 15,
                    top: targetY - res.top - 15,
                }
            });

            // 更新进度条和时间显示
            this.drawProgress(currentAngle);
            this.updateTime(currentAngle);
        }).exec();
    },

    // 根据角度计算分钟数
    calculateMinutesFromAngle(angle: number): number {
        // 将角度转换为0-2π范围（从顶部开始）
        let normalizedAngle = angle + Math.PI / 2;
        if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

        // 计算分钟数（2π对应120分钟）
        const minutes = (normalizedAngle / (2 * Math.PI)) * 120;
        return Math.round(minutes / 5) * 5; // 5分钟为步长
    },

    updateTime(currentAngle: number) {
        const { lastAngle, totalDiff, lastDisplayedMinutes } = this.data;
        let angleDiff = currentAngle - lastAngle;

        // 处理角度跳变（跨过Math.PI边界）
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        const newTotalDiff = totalDiff + angleDiff;

        // 计算当前分钟数
        const minutes = this.calculateMinutesFromAngle(currentAngle);
        const clampedMinutes = Math.max(this.data.minMinutes, Math.min(this.data.maxMinutes, minutes));

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
        this.initCanvas();
    },

    // 初始化 Canvas
    async initCanvas() {
        const query = wx.createSelectorQuery();
        query.select('#progressCanvas')
            .fields({ node: true, size: true })
            .exec(async (res) => {
                const canvas = res[0].node;
                const ctx = canvas.getContext('2d');

                // 设置 Canvas 实际渲染尺寸
                const dpr = wx.getSystemInfoSync().pixelRatio;
                canvas.width = 215 * dpr;
                canvas.height = 215 * dpr;
                ctx.scale(dpr, dpr);

                this.setData({ canvasContext: ctx });
                this.drawProgress(this.data.lastAngle);
            });
    },

    // 绘制进度条
    drawProgress(currentAngle: number) {
        const ctx = this.data.canvasContext;
        if (!ctx) return;

        // 清除画布
        ctx.clearRect(0, 0, 215, 215);

        // 计算当前分钟数
        const minutes = this.calculateMinutesFromAngle(currentAngle);

        // 绘制进度条
        ctx.beginPath();

        // 起始角度始终是顶部（-π/2）
        let startAngle = -Math.PI / 2;

        // 结束角度
        let endAngle = currentAngle;

        // 如果超过1小时（60分钟），则固定结束角度为3π/2（即1小时位置）
        if (minutes > 60) {
            endAngle = Math.PI / 2; // 3π/2 - 2π = -π/2，但我们需要正角度
        }

        // 绘制主进度条
        ctx.arc(107.5, 107.5, 92, startAngle, endAngle, false);
        ctx.strokeStyle = '#ff6347'; // 进度条颜色
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 如果超过1小时，绘制第二段进度条（固定颜色）
        if (minutes > 60) {
            ctx.beginPath();
            ctx.arc(107.5, 107.5, 92, Math.PI / 2, currentAngle, false);
            ctx.strokeStyle = '#ff6347'; // 可以设置为不同颜色
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
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

    // 未实现功能，提醒等待升级
    waitingUpdate() {
        wx.showToast({
            title: '开发中，敬请期待…',
            icon: 'none',
            duration: 2000
        })
    },

    // 弹层显示管理
    showBzy() {
        this.setData({ show_bzy: true });
      },
    
      closeBzy() {
        this.setData({ show_bzy: false });
      },

    //   打开排行榜
    goToRanklist() {
        wx.navigateTo({
            url: '../rank_list/rank_list'
        })
    }
})