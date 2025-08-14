// pages/settings/settings.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
      notice_switch: false,
      ad_switch: false,
      showTimeSet: false,
      timeList: [
        { name: '前一天中午12:00', time: '12:00' },
        { name: '当天的晚上00:00', time: '00:00' },
      ],
      selectedTime: '12:00', // 存储当前选中的时间值
      selectedTimeIndex: 0, // 添加选中的时间索引
      avatarUrl: '', // 存储头像URL
      nickName: ''   // 存储昵称
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      // 从本地存储加载设置
      this.loadSettings();
    },
  
    loadSettings() {
        try {
          const settings = wx.getStorageSync('userSettings') || {};
          this.setData({
            notice_switch: settings.notice_switch || false,
            ad_switch: settings.ad_switch || false,
          });
        } catch (e) {
          console.error('加载设置失败:', e);
        }
      },
  
    // 保存设置到本地存储
    saveSettings() {
        try {
          wx.setStorageSync('userSettings', {
            notice_switch: this.data.notice_switch,
            ad_switch: this.data.ad_switch,
            selectedTime: this.data.selectedTime,
          });
        } catch (e) {
          console.error('保存设置失败:', e);
        }
      },
  
    // 通知开关变化
    onChangeNotice({ detail }: { detail: boolean }) {
      this.setData({ notice_switch: detail });
      this.saveSettings();
      console.log('通知开关:', this.data.notice_switch);
    },
  
    // 广告开关变化
    onChangeAd({ detail }: { detail: boolean }) {
      this.setData({ ad_switch: detail });
      this.saveSettings();
      console.log('广告开关:', this.data.ad_switch);
    },
  
    // 显示时间设置
    onShowTimeSet() {
      this.setData({ showTimeSet: true });
    },
  
    // 关闭时间设置
    closeNoticeTimeSet() {
      this.setData({ showTimeSet: false });
    },
  
    onSelectTime(event: WechatMiniprogram.CustomEvent<{name: string}> | WechatMiniprogram.TapEvent) {
        let selectedName: string;
        
        // 处理两种可能的事件类型
        if ('detail' in event && event.detail && 'name' in event.detail) {
          // CustomEvent 类型，从 detail 获取
          selectedName = (event as WechatMiniprogram.CustomEvent<{name: string}>).detail.name;
        } else {
          // TapEvent 类型，从 dataset 获取
          selectedName = (event as WechatMiniprogram.TapEvent).currentTarget.dataset.name;
        }
        
        // 根据 name 查找对应的 time
        const selectedItem = this.data.timeList.find(item => item.name === selectedName);
        
        if (selectedItem) {
          this.setData({
            selectedTime: selectedItem.time,
            showTimeSet: false,
          });
          this.saveSettings();
          console.log('选择的时间:', selectedItem.time);
        }
      },

 // 选择头像回调
 onChooseAvatar(e: WechatMiniprogram.CustomEvent) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl
    })
    // 可以在这里保存到服务器
  },

  // 输入昵称回调
  onNickNameInput(e: WechatMiniprogram.Input) {
    this.setData({
      nickName: e.detail.value
    })
    // 可以在这里保存到服务器
  },

  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      // 每次显示页面时检查是否有更新
      this.loadSettings();
    },
  
    // 其他生命周期函数保持不变...
    onReady() {},
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {}
  });