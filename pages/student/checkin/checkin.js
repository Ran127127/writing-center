// pages/student/checkin/checkin.js —— 钉钉版
const util = require('../../../utils/util');

Page({
  data: {
    booking: null,
    canCheckin: false,
    checkinDone: false,
    checkinTime: '',
    countdown: '',
    _timer: null,
  },

  onLoad() {
    const booking = util.getStorage('myBooking');
    if (!booking) {
      util.showToast('未找到预约信息');
      dd.navigateBack();
      return;
    }
    this.setData({ booking });
    this.checkCheckinWindow(booking);
  },

  onUnload() {
    if (this.data._timer) clearInterval(this.data._timer);
  },

  checkCheckinWindow(booking) {
    const { startTs } = booking;
    const diff = startTs - Date.now();
    // 开课前30min ~ 开课后10min 可签到
    const canCheckin = diff <= 30 * 60 * 1000 && diff >= -10 * 60 * 1000;
    this.setData({ canCheckin });

    if (!canCheckin && diff > 0) {
      const timer = setInterval(() => {
        const d = booking.startTs - Date.now();
        if (d <= 30 * 60 * 1000) {
          this.setData({ canCheckin: true, countdown: '' });
          clearInterval(this.data._timer);
          return;
        }
        const h = Math.floor(d / 3600000);
        const m = Math.floor((d % 3600000) / 60000);
        const s = Math.floor((d % 60000) / 1000);
        this.setData({ countdown: `${h > 0 ? h + '小时' : ''}${m}分${s}秒后开放签到` });
      }, 1000);
      this.setData({ _timer: timer });
    }
  },

  doCheckin() {
    if (!this.data.canCheckin) return;
    dd.confirm({
      title: '确认签到',
      content: '确认本人已到场参加上课？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (res) => {
        if (res.confirm) {
          const checkinTime = util.formatDateTime(new Date());
          const booking = { ...this.data.booking, status: 'checkin', checkinTime };
          util.setStorage('myBooking', booking);
          this.setData({ checkinDone: true, checkinTime });
          util.showToast('签到成功！', 'success');
        }
      },
    });
  },
});
