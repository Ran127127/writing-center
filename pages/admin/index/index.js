// pages/admin/index/index.js —— 钉钉版
const util = require('../../../utils/util');

Page({
  data: {
    overview: { totalSlots: 28, totalClass: 22, totalStudents: 35, avgScore: 88 },
    pendingList: [],
    loading: true,
  },

  onLoad()  { this.loadData(); },
  onShow()  { this.loadData(); },

  async loadData() {
    this.setData({ loading: true });
    await util.sleep(300);
    const pendingList = [
      { id: 1, name: '王五', studentId: '2022088', date: '2026-05-23', time: '10:00-11:00', issue: '未提前取消，未参加', suspended: false },
    ];
    this.setData({ pendingList, loading: false });
  },

  suspendStudent(e) {
    const id = e.currentTarget.dataset.id;
    dd.confirm({
      title: '暂停报名资格',
      content: '确认暂停该学生本周报名资格？',
      confirmButtonText: '确认暂停',
      cancelButtonText: '取消',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.pendingList.map(s => s.id === id ? { ...s, suspended: true } : s);
          this.setData({ pendingList: list });
          util.showToast('已暂停', 'success');
        }
      },
    });
  },

  toSchedule() { dd.navigateTo({ url: '/pages/admin/schedule/schedule' }); },
  toStats()    { dd.navigateTo({ url: '/pages/admin/stats/stats' }); },
});
