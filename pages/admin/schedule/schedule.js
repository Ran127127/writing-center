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
    try {
      await util.sleep(300);
      const slots = [
        { id: 1, date: '2026-06-02', day: '周一', time: '09:00-10:00', quota: 1, booked: 1, publishTime: '2026-05-28 12:30' },
        { id: 2, date: '2026-06-03', day: '周二', time: '14:00-15:00', quota: 2, booked: 1, publishTime: '2026-05-28 12:30' },
      ];
      this.setData({ slots, loading: false });
    } catch (e) {
      this.setData({ loading: false });
      util.showToast('加载失败，请重试');
    }
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
    const quotaNum = parseInt(form.quota);
    if (isNaN(quotaNum) || quotaNum <= 0) {
      util.showToast('名额必须为正整数');
      return;
    }
    this.setData({ submitting: true });
    try {
      await util.sleep(500);
      const days = ['日','一','二','三','四','五','六'];
      const [y, m, d] = form.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const day  = '周' + days[dateObj.getDay()];
      const newSlot = { id: Date.now(), date: form.date, day, time: form.time, quota: quotaNum, booked: 0, publishTime: util.formatDateTime(new Date()) };
      this.setData({ slots: [newSlot, ...this.data.slots], form: { date: '', time: '', quota: '1' } });
      util.showToast('发布成功！', 'success');
    } catch (e) {
      util.showToast('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  },

  deleteSlot(e) {
    const id = e.currentTarget.dataset.id;
    const slot = this.data.slots.find(s => s.id === id);
    const hasBookings = slot && slot.booked > 0;
    dd.confirm({
      title: '删除时段',
      content: hasBookings ? `该时段已有 ${slot.booked} 人预约，删除后学生预约将失效。确认删除？` : '确认删除该时段？',
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
