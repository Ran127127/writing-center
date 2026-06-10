// pages/teacher/index/index.js —— 钉钉版
const util = require('../../../utils/util');

Page({
  data: {
    notifications: [],
    upcomingSlots: [],
    loading: true,
    _loaded: false,
  },

  onLoad()  { this.loadData(); },
  onShow() {
    if (this.data._loaded) { this.loadData(); }
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      await util.sleep(300);

      const notifications = [
        { id: 1, type: 'no_class', message: '本周五 14:00-15:00 无学生预约，无需上课', time: '2026-05-29 10:00', confirmed: false },
        { id: 2, type: 'cancel',   message: '学生张三取消了本周四 10:00-11:00 的预约，该时段无需上课', time: '2026-05-28 15:30', confirmed: true },
      ];
      const upcomingSlots = [
        { id: 1, date: '2026-06-02', day: '周一', time: '09:00-10:00', studentName: '李四', studentId: '2023001', problem: '微积分第三章的极限习题', status: 'booked', checkinDone: false },
      ];
      this.setData({ notifications, upcomingSlots, loading: false, _loaded: true });
    } catch (e) {
      this.setData({ loading: false });
      util.showToast('加载失败，请重试');
    }
  },

  confirmNotification(e) {
    const id = e.currentTarget.dataset.id;
    const notifications = this.data.notifications.map(n => {
      if (n.id === id && !n.confirmed) { return { ...n, confirmed: true }; }
      return n;
    });
    this.setData({ notifications });
    util.showToast('已确认', 'success');
  },

  // 标记学生已签到
  markCheckin(e) {
    const id = e.currentTarget.dataset.id;
    const upcomingSlots = this.data.upcomingSlots.map(s => s.id === id ? { ...s, checkinDone: true } : s);
    this.setData({ upcomingSlots });
    util.showToast('已标记签到', 'success');
  },

  toConfirmPage() {
    dd.navigateTo({ url: '/pages/teacher/confirm/confirm' });
  },
});
