Page({
    /**
     * 页面的初始数据
     */
    data: {
        slider_x: 0,
        btn_x: 0,
        btn_y: 0,
        currentTime: {
            main: "00:25",
            seconds: "00"
        },
        totalDiff: 0,
        lastDisplayedMinutes: 25,
        canvasContext: null as any, // 存储 Canvas 上下文
        buttonPosition: { left: 0, top: 0 }, // 初始位置将在init中计算
        lastAngle: -Math.PI / 12, // 25分钟对应的初始角度
        canvasSize: 0, // 动态计算的canvas大小
        trackSize: 0, // 轨道容器的尺寸
        isDragging: false,
        maxMinutes: 120,
        minMinutes: 0,
        is_vibrated: false,
        show_bzy: false,
        soundItems: [
            {
                name: "繁喧饭店",
                icon: "../../resources/light-icons/sound_1.png",
                checkedIcon: "../../resources/light-icons/sound_1_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/cofe.mp3",
                checked: false
            },
            {
                name: "禅声回荡",
                icon: "../../resources/light-icons/sound_2.png",
                checkedIcon: "../../resources/light-icons/sound_2_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/temple.mp3",
                checked: false
            },
            {
                name: "和风海滩",
                icon: "../../resources/light-icons/sound_3.png",
                checkedIcon: "../../resources/light-icons/sound_3_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/wave.mp3",
                checked: false
            },
            {
                name: "大漠孤烟",
                icon: "../../resources/light-icons/sound_4.png",
                checkedIcon: "../../resources/light-icons/sound_4_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/desert.mp3",
                checked: false
            },
            {
                name: "雨夜炉火",
                icon: "../../resources/light-icons/sound_5.png",
                checkedIcon: "../../resources/light-icons/sound_5_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/thunder.mp3",
                checked: false
            },
            {
                name: "林海鸟啼",
                icon: "../../resources/light-icons/sound_6.png",
                checkedIcon: "../../resources/light-icons/sound_6_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/wood.mp3",
                checked: false
            },
            {
                name: "蝉声蛙鸣",
                icon: "../../resources/light-icons/sound_7.png",
                checkedIcon: "../../resources/light-icons/sound_7_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/frog.mp3",
                checked: false
            },
            {
                name: "火车铁轨",
                icon: "../../resources/light-icons/sound_8.png",
                checkedIcon: "../../resources/light-icons/sound_8_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/train.mp3",
                checked: false
            },
            {
                name: "高速路旁",
                icon: "../../resources/light-icons/sound_9.png",
                checkedIcon: "../../resources/light-icons/sound_9_c.png",
                soundPath: "https://tomatocube-sounds.oss-cn-shenzhen.aliyuncs.com/road.mp3",
                checked: false,
            },
        ],
        audioManager: wx.getBackgroundAudioManager(),
        isPlaying: false,
        currentAudioContext: null as WechatMiniprogram.InnerAudioContext | null, // 明确声明类型
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

        const query = wx.createSelectorQuery().in(this);
        query.select('.track').boundingClientRect((res) => {
            const centerX = res.width / 2;
            const centerY = res.height / 2;
            const radius = centerX * 0.85; // 与进度条半径保持一致

            const touchX = event.touches[0].clientX - res.left;
            const touchY = event.touches[0].clientY - res.top;

            // 计算当前角度（弧度）
            let currentAngle = Math.atan2(touchY - centerY, touchX - centerX);

            // 确保按钮始终在圆环上
            currentAngle = this.constrainAngleToCircle(currentAngle);

            // 计算PX位置 - 确保按钮在圆环上
            const pxX = centerX + radius * Math.cos(currentAngle);
            const pxY = centerY + radius * Math.sin(currentAngle);

            this.setData({
                buttonPosition: {
                    left: pxX,
                    top: pxY
                },
                trackSize: res.width
            });

            // 更新进度条和时间显示
            this.drawProgress(currentAngle);
            this.updateTime(currentAngle);
        }).exec();
    },

    // 拖动结束时校准位置
    onDragEnd() {
        const { lastDisplayedMinutes, trackSize } = this.data;
        if (trackSize > 0) {
            const center = trackSize / 2;
            const radius = center * 0.85;
            const syncedAngle = this.calculateAngleFromMinutes(lastDisplayedMinutes);

            this.setData({
                lastAngle: syncedAngle,
                buttonPosition: {
                    left: center + radius * Math.cos(syncedAngle),
                    top: center + radius * Math.sin(syncedAngle)
                },
                isDragging: false
            });
            this.drawProgress(syncedAngle);
        }
    },

    // 约束角度，确保按钮始终在圆环上
    constrainAngleToCircle(angle: number): number {
        // 计算角度对应的分钟数
        const minutes = this.calculateMinutesFromAngle(angle);
        const clampedMinutes = Math.max(this.data.minMinutes, Math.min(this.data.maxMinutes, minutes));

        // 根据约束后的分钟数反推角度，确保按钮在圆环上
        return this.calculateAngleFromMinutes(clampedMinutes);
    },

    // 根据角度计算分钟数
    calculateMinutesFromAngle(angle: number): number {
        // 将角度转换为0-2π范围（从顶部开始）
        let normalizedAngle = angle + Math.PI / 2;
        if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

        // 计算分钟数（2π对应120分钟）
        return (normalizedAngle / (2 * Math.PI)) * this.data.maxMinutes;
    },

    // 根据分钟数计算角度
    calculateAngleFromMinutes(minutes: number): number {
        // 将分钟数转换为角度（120分钟对应2π）
        const normalizedAngle = (minutes / this.data.maxMinutes) * 2 * Math.PI;
        // 转换为从右侧开始的角度（减去90度即-π/2）
        return normalizedAngle - Math.PI / 2;
    },

    updateTime(currentAngle: number) {
        // 计算当前分钟数并取5分钟步长
        const minutes = this.calculateMinutesFromAngle(currentAngle);
        const clampedMinutes = Math.max(this.data.minMinutes, Math.min(this.data.maxMinutes, minutes));
        const roundedMinutes = Math.round(clampedMinutes / 5) * 5;

        // 只有当分钟数变化时才更新显示和振动
        if (roundedMinutes !== this.data.lastDisplayedMinutes) {
            const hours = Math.floor(roundedMinutes / 60);
            const mins = roundedMinutes % 60;

            // 触发振动
            wx.vibrateShort({ type: 'heavy' });

            this.setData({
                currentTime: {
                    main: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
                    seconds: "00"
                },
                lastDisplayedMinutes: roundedMinutes,
                lastAngle: currentAngle,
            });
        } else {
            // 分钟数没变化时只更新角度数据
            this.setData({
                lastAngle: currentAngle,
            });
        }
    },

    // 处理点击事件
    handleSoundSwitch(e: WechatMiniprogram.TouchEvent) {
        const index = e.currentTarget.dataset.index;
        const soundItems = this.data.soundItems.map((item, i) => ({
            ...item,
            checked: i === index
        }));

        this.setData({ soundItems });

        // 停止当前播放的音频
        this.stopCurrentAudio();
        
        // 播放新选择的音频
        this.playSoundEffect(index);
    },

    // 停止当前音频
    stopCurrentAudio() {
        const { currentAudioContext, audioManager } = this.data;
        
        // 停止innerAudioContext
        if (currentAudioContext) {
            currentAudioContext.stop();
            currentAudioContext.destroy();
            this.setData({ currentAudioContext: null });
        }
        
        // 停止backgroundAudioManager
        if (audioManager) {
            audioManager.stop();
        }
        
        this.setData({ isPlaying: false });
    },

    playSoundEffect(index: number) {
        const { soundItems } = this.data;
        if (index >= soundItems.length) return;

        const currentItem = soundItems[index];
        
        // 显示加载提示
        wx.showToast({
            title: `正在加载${currentItem.name}...`,
            icon: 'none',
            duration: 500
        });

        // 创建新的音频上下文
        const innerAudioContext = wx.createInnerAudioContext();
        innerAudioContext.src = currentItem.soundPath;
        innerAudioContext.loop = true; // 设置循环播放

        // 播放成功回调
        innerAudioContext.onPlay(() => {
            console.log('开始播放');
            this.setData({ 
                isPlaying: true,
                currentAudioContext: innerAudioContext 
            });
        });

        // 错误处理
        innerAudioContext.onError((res) => {
            console.error('播放错误:', res);
            wx.showToast({
                title: '播放失败，请检查音频源',
                icon: 'none'
            });
            this.setData({ isPlaying: false });
        });

        // 开始播放
        innerAudioContext.play();
    },


    // 初始化 Canvas
    async initCanvas() {
        try {
            const query = wx.createSelectorQuery().in(this);

            // 先获取容器尺寸
            query.select('.track').boundingClientRect((trackRes) => {
                const size = Math.min(trackRes.width, trackRes.height);
                const center = size / 2;
                const radius = center * 0.85; // 与进度条半径保持一致

                // 计算初始按钮位置（PX单位）
                const initialAngle = this.data.lastAngle;
                const initialX = center + radius * Math.cos(initialAngle);
                const initialY = center + radius * Math.sin(initialAngle);

                this.setData({
                    canvasSize: size,
                    trackSize: size,
                    buttonPosition: {
                        left: initialX,
                        top: initialY
                    }
                });

                // 然后获取Canvas节点
                const canvasQuery = wx.createSelectorQuery().in(this);
                canvasQuery.select('#progressCanvas')
                    .fields({ node: true, size: true })
                    .exec((canvasRes) => {
                        if (!canvasRes[0] || !canvasRes[0].node) {
                            console.error('Canvas node not found');
                            return;
                        }

                        const canvas = canvasRes[0].node;
                        const ctx = canvas.getContext('2d');

                        // 设置 Canvas 实际渲染尺寸
                        const dpr = wx.getSystemInfoSync().pixelRatio;
                        canvas.width = size * dpr;
                        canvas.height = size * dpr;
                        ctx.scale(dpr, dpr);

                        this.setData({ canvasContext: ctx }, () => {
                            // 初始化绘制进度条
                            this.drawProgress(initialAngle);
                        });
                    });
            }).exec();
        } catch (error) {
            console.error('Canvas initialization failed:', error);
        }
    },

    // 绘制进度条
    drawProgress(currentAngle: number) {
        const ctx = this.data.canvasContext;
        const size = this.data.canvasSize;
        if (!ctx || !size) return;

        // 清除画布
        ctx.clearRect(0, 0, size, size);

        const center = size / 2;
        const radius = center * 0.85; // 进度条半径

        // 绘制主进度条（从顶部开始到当前角度）
        ctx.beginPath();
        ctx.arc(center, center, radius, -Math.PI / 2, currentAngle, false);
        ctx.strokeStyle = '#ff6347';
        ctx.lineWidth = size * 0.09; // 响应式线宽
        ctx.lineCap = 'round';
        ctx.stroke();
    },

    // 触摸开始事件
    handleTouchStart(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            startX: e.touches[0].clientX,
            isDragging: true
        });
    },

    switchPlayState() {
        const { isPlaying, currentAudioContext, audioManager } = this.data;
        
        if (currentAudioContext) {
            if (isPlaying) {
                // 暂停播放
                currentAudioContext.pause();
                this.setData({ isPlaying: false });
            } else {
                // 继续播放
                currentAudioContext.play();
                this.setData({ isPlaying: true });
            }
        } else if (audioManager) {
            // 处理backgroundAudioManager的情况
            if (isPlaying) {
                audioManager.pause();
                this.setData({ isPlaying: false });
            } else {
                audioManager.play();
                this.setData({ isPlaying: true });
            }
        } else {
            wx.showToast({
                title: '请选择一个音频',
                icon: 'none'
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
        // 初始化音频管理器
        const audioManager = wx.getBackgroundAudioManager();
        this.setData({ audioManager });

        // 初始化Canvas
        this.initCanvas();
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

    // 打开排行榜
    goToRanklist() {
        wx.navigateTo({
            url: '../rank_list/rank_list'
        })
    }
})