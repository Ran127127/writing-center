// pages/teacher/confirm/confirm.js —— 钉钉版
const util = require('../../../utils/util');

Page({
  data: { bookings: [], loading: true, _loaded: false },

  onLoad()  { this.loadData(); },
  onShow() {
    if (this.data._loaded) { this.loadData(); }
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      await util.sleep(300);
      const bookings = [
        { id: 1, date: '2026-06-02', day: '周一', time: '09:00-10:00', studentName: '李四', studentId: '2023001', grade: '2023级', major: '数学', problem: '微积分极限习题', status: 'booked' },
        { id: 2, date: '2026-06-03', day: '周二', time: '14:00-15:00', studentName: '王芳', studentId: '2022055', grade: '2022级', major: '物理', problem: '量子力学薛定谔方程推导', status: 'booked' },
      ];
      this.setData({ bookings, loading: false, _loaded: true });
    } catch (e) {
      this.setData({ loading: false });
      util.showToast('加载失败，请重试');
    }
  },
});
