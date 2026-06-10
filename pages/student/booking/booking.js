// pages/student/booking/booking.js —— 钉钉版
const app  = getApp();
const util = require('../../../utils/util');

Page({
  data: {
    slotId: '', date: '', time: '', day: '',
    form: {
      name: '', studentId: '', grade: '', major: '', problem: '',
      materials: [],   // [{name, path}]
    },
    submitting: false,
    _checkInterval: null,
  },

  onLoad(options) {
    this.setData({ slotId: options.slotId, date: options.date, time: options.time, day: decodeURIComponent(options.day || '') });

    // ── 钉钉免登：自动预填姓名 / 工号 ──────────────────────────
    // app.globalData.userInfo 在 app.js 的 ddLogin 成功后已填充
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        'form.name':      userInfo.name      || '',
        'form.studentId': userInfo.staffId   || '',  // 钉钉工号作为学号
      });
    }
    // 若 globalData 还未就绪（首次冷启动），监听赋值
    if (!userInfo) {
      this.setData({
        _checkInterval: setInterval(() => {
          const u = app.globalData.userInfo;
          if (u) {
            clearInterval(this.data._checkInterval);
            this.setData({ _checkInterval: null, 'form.name': u.name || '', 'form.studentId': u.staffId || '' });
          }
        }, 500),
      });
    }
  },

  onUnload() {
    if (this.data._checkInterval) {
      clearInterval(this.data._checkInterval);
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  // 上传材料（钉钉用 dd.chooseImage / dd.chooseFile）
  uploadMaterial() {
    dd.chooseImage({
      count: 3,
      success: (res) => {
        const files = res.apFilePaths.map((p, i) => ({ name: `图片${i + 1}`, path: p }));
        this.setData({ 'form.materials': [...this.data.form.materials, ...files] });
      },
    });
  },

  removeMaterial(e) {
    const idx       = e.currentTarget.dataset.idx;
    const materials = this.data.form.materials.filter((_, i) => i !== idx);
    this.setData({ 'form.materials': materials });
  },

  async submitBooking() {
    const { form, slotId, date, time, day } = this.data;
    if (!form.name)      { util.showToast('请填写姓名');           return; }
    if (!form.studentId) { util.showToast('请填写学号');           return; }
    if (!form.grade || !form.major) { util.showToast('请填写年级和专业'); return; }
    if (!form.problem)   { util.showToast('请填写需要解决的问题'); return; }
    if (form.problem.length < 20) { util.showToast('问题描述至少需要20个字'); return; }

    this.setData({ submitting: true });
    try {
      const startTs = new Date(`${date} ${time.split('-')[0]}`).getTime();
      if (!util.isMoreThanNHoursAway(startTs, 24)) {
        util.showToast('需提前24小时预约');
        this.setData({ submitting: false });
        return;
      }
      // 模拟提交（实际替换为 app.request）
      await util.sleep(600);
      const booking = { slotId, date, time, day, startTs, ...form, status: 'booked', bookTime: util.formatDateTime(new Date()) };
      util.setStorage('myBooking', booking);
      util.showToast('预约成功！', 'success');
      setTimeout(() => { dd.navigateBack({ delta: 1 }); }, 1500);
    } catch (e) {
      util.showToast('预约失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  },
});
