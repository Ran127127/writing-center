// pages/student/evaluation/evaluation.js —— 钉钉版
const util = require('../../../utils/util');

Page({
  data: {
    booking: null,
    form: { lateOrLeave: '', solved: '', score: 60 },
    submitting: false,
    submitted: false,
  },

  onLoad() {
    const booking = util.getStorage('myBooking');
    if (!booking) { util.showToast('未找到课程信息'); return; }
    const evalDone = util.getStorage(`eval_${booking.slotId}`);
    this.setData({ submitted: !!evalDone, booking });
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onScoreChange(e) {
    this.setData({ 'form.score': e.detail.value });
  },

  async submitEval() {
    const { form, booking } = this.data;
    if (!form.lateOrLeave) { util.showToast('请回答第一个问题'); return; }
    if (!form.solved)       { util.showToast('请回答第二个问题'); return; }

    this.setData({ submitting: true });
    try {
      await util.sleep(500);
      util.setStorage(`eval_${booking.slotId}`, { ...form, submitTime: util.formatDateTime(new Date()) });
      this.setData({ submitted: true });
      util.showToast('评价提交成功！', 'success');
    } catch (e) {
      util.showToast('提交失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  },
});
