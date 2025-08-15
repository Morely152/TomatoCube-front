// pages/staticstics/statistics.ts

type Cell = {
  date: string;
  hour: number;
  value: number;
  color: string;
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /**
    *专注报表
    */
    today_amounts: 0,
    today_duration_hour: 0,
    today_duration_minute: 0,
    today_surpass: 0,
    week_amounts: 0,
    week_duration_hour: 0,
    week_duration_minute: 0,
    week_surpass: 0,
    all_amounts: 0,
    all_duration_hour: 0,
    all_duration_minute: 0,
    all_surpass: 0,
    /**
    *专注热力图
    */
    hours: [5, 11, 17, 23],
    dates: [] as string[],
    matrix: [] as any[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.initDates();
    this.renderHeatmap();
  },

  // 点击导航栏跳转到此页面时
  onTabItemTap() {
    wx.vibrateShort({ type: 'heavy' });
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
  /**
      *专注热力图
  */
  // 生成 7 天日期（当天在最左）
  initDates() {
    const today = new Date();
    const arr: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const m = String(d.getMonth() + 1);
      const dd = String(d.getDate());
      arr.push(`${m}月${dd}日`);
    }
    this.setData({ dates: arr });
  },

  // 渲染热力图，调整 hours 对应列的标识等逻辑
  renderHeatmap() {
    const list = [
      { date: '8-14', hour: 5, value: 351 },
      { date: '8-14', hour: 11, value: 200 },
      { date: '8-13', hour: 17, value: 120 },
      { date: '8-12', hour: 23, value: 60 },
      { date: '8-11', hour: 5, value: 200 },
      { date: '8-10', hour: 11, value: 90 },
      { date: '8-9', hour: 17, value: 30 },
      { date: '8-8', hour: 23, value: 10 }
    ];

    const values = list.map(d => d?.value ?? 0);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // 新：颜色插值函数
    const color = (v: number) => {
      const t = (v - min) / (max - min || 1);
      const start = hexToRgb('#eec3bb');
      const end = hexToRgb('#FF6347');
      const r = Math.round(start.r + t * (end.r - start.r));
      const g = Math.round(start.g + t * (end.g - start.g));
      const b = Math.round(start.b + t * (end.b - start.b));
      return `rgb(${r},${g},${b})`;
    };

    // 辅助函数：十六进制转 RGB
    function hexToRgb(hex: string) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    }

    const grid: Cell[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => ({ date: '', hour: 0, value: 0, color: '#eee' }))
    );
    list.forEach(item => {
      const { date = '', hour = 0, value = 0 } = item;
      // 这里要注意，原数据里的 date 是 '8-14' 格式，而 dates 里存的是 '8月14日' 格式，需要转换匹配
      const targetDate = this.convertToDisplayDate(date);
      const x = this.data.dates.indexOf(targetDate);
      if (x !== -1 && hour >= 0 && hour < 24) {
        grid[x][hour] = { date: targetDate, hour, value, color: color(value) };
      }
    });
    this.setData({ matrix: grid.flat() });
  },

  // 辅助函数：将 '8-14' 格式转为 '8月14日' 格式，用于日期匹配
  convertToDisplayDate(shortDate: string) {
    const [month, day] = shortDate.split('-');
    return `${month}月${day}日`;
  },

  /*  点击事件：e 用可选链兜底 */
  onCellTap(e: any) {
    const { date, hour, value } = e.currentTarget.dataset;
    if (!date) return;
    wx.showModal({
      title: `${date} ${hour}:00`,        // 第一行
      content: `专注：${value} 分钟`,    // 第二行
      showCancel: false
    });
  },
})