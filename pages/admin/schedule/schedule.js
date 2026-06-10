// pages/admin/schedule/schedule.js —— 钉钉版
const util = require('../../../utils/util');

Page({
  data: {
    slots: [],
    form: { date: '', time: '', quota: '1' },
    submitting: false,
    loading: true,
  },

  onLoad()  { this.loadData(); },

  async loadData() {
    this.setData({ loading: true });
    await util.sleep(300);
    const slots = [
      { id: 1, date: '2026-06-02', day: '周一', time: '09:00-10:00', quota: 1, booked: 1, publishTime: '2026-05-28 12:30' },
      { id: 2, date: '2026-06-03', day: '周二', time: '14:00-15:00', quota: 2, booked: 1, publishTime: '2026-05-28 12:30' },
    ];
    this.setData({ slots, loading: false });
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  async publishSlot() {
    const { form } = this.data;
    if (!form.date)  { util.showToast('请选择日期'); return; }
    if (!form.time)  { util.showToast('请填写时间段'); return; }
    if (!form.quota) { util.showToast('请填写名额'); return; }
    this.setData({ submitting: true });
    try {
      await util.sleep(500);
      const days = ['日','一','二','三','四','五','六'];
      const d    = new Date(form.date);
      const day  = '周' + days[d.getDay()];
      const newSlot = { id: Date.now(), date: form.date, day, time: form.time, quota: parseInt(form.quota), booked: 0, publishTime: util.formatDateTime(new Date()) };
      this.setData({ slots: [newSlot, ...this.data.slots], form: { date: '', time: '', quota: '1' } });
      util.showToast('发布成功！', 'success');
    } catch {
      util.showToast('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  },

  deleteSlot(e) {
    const id = e.currentTarget.dataset.id;
    dd.confirm({
      title: '删除时段',
      content: '确认删除该时段？',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.setData({ slots: this.data.slots.filter(s => s.id !== id) });
          util.showToast('已删除', 'success');
        }
      },
    });
  },
});
