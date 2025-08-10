// pages/rank_list/rank_list.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前榜单类型：'daily' 或 'weekly'
    rankType: 'daily',
    
    // 日榜数据
    dailyData: {
      onlineCount: 0,
      totalFocus: 0,
      teamCount: 0,
      rankList: [
        { rank: 1, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 2, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 3, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 4, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 5, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 6, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 7, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 8, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 9, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 10, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' }
      ]
    },
    
    // 周榜数据
    weeklyData: {
      onlineCount: 0,
      totalFocus: 0,
      teamCount: 0,
      rankList: [
        { rank: 1, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 2, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 3, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 4, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 5, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 6, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 7, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 8, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 9, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' },
        { rank: 10, avatar: '/resources/light-icons/default-touxiang.png', name: '用户', time: '00时00分' }
      ]
    }
  },

    // 切换榜单类型
    switchRankType() {
        const newType = this.data.rankType === 'daily' ? 'weekly' : 'daily'
        this.setData({
          rankType: newType
        })
      },

    refreshData() {
        wx.showToast({
            title: '正在刷新…',
            icon: 'loading',
            duration: 2000
        })
    },

    // 点击分享按钮时
    shareRank() {
        // 这里还没实现
        wx.showToast({
            title: '还没弄清楚怎么直接分享，先点击右上角分享吧(；′⌒`)',
            icon: 'none',
            duration: 2000
        })
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
        // 获取当前页面路径（会自动带上参数）
        const path = this.route

        return {
            title: '点击查看专注排行榜 - 番茄魔方', // 分享标题
            path: `/pages/${path}`, // 分享路径，用户点击后会跳转到这个页面
            imageUrl: '../../resources/light-icons/default-touxiang.png' // 可选，分享图片
        }
    }
})