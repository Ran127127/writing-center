// pages/admin/stats/stats.js —— 钉钉版
const util = require('../../../utils/util');

Page({
  data: {
    semester: '2025-2026学年第二学期',
    summary: {
      totalPublished: 28,
      totalClass:     22,
      cancelRate:     '7.1%',
      noShowRate:     '3.6%',
      avgScore:       88,
      evalCount:      20,
    },
    studentList: [],
    suspendedList: [],
    loading: true,
    activeTab: 'all',  // 'all' | 'suspended'
  },

  onLoad()  { this.loadData(); },
  onShow()  { this.loadData(); },

  async loadData() {
    this.setData({ loading: true });
    await util.sleep(300);

    const studentList = [
      { id: 1, name: '李四',   studentId: '2023001', grade: '2023级', major: '数学',   classCount: 3, evalScore: 92, suspended: false },
      { id: 2, name: '王芳',   studentId: '2022055', grade: '2022级', major: '物理',   classCount: 2, evalScore: 85, suspended: false },
      { id: 3, name: '王五',   studentId: '2022088', grade: '2022级', major: '化学',   classCount: 1, evalScore: 0,  suspended: true  },
      { id: 4, name: '赵六',   studentId: '2024010', grade: '2024级', major: '生物',   classCount: 4, evalScore: 95, suspended: false },
    ];

    const suspendedList = studentList.filter(s => s.suspended);
    this.setData({ studentList, suspendedList, loading: false });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  // 解除暂停
  liftSuspension(e) {
    const id = e.currentTarget.dataset.id;
    dd.confirm({
      title: '解除暂停',
      content: '确认恢复该学生的报名资格？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (res) => {
        if (res.confirm) {
          const studentList    = this.data.studentList.map(s => s.id === id ? { ...s, suspended: false } : s);
          const suspendedList  = studentList.filter(s => s.suspended);
          this.setData({ studentList, suspendedList });
          util.showToast('已解除暂停', 'success');
        }
      },
    });
  },
});
