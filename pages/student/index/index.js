// pages/student/index/index.js —— 钉钉版
const app = getApp();
const util = require('../../../utils/util');

Page({
  data: {
    userInfo: null,
    weekSlots: [],
    myBooking: null,
    loading: true,
    _loaded: false,
  },

  onLoad() {
    const userInfo = app.globalData.userInfo;
    this.setData({ userInfo });
    this.loadData();
  },

  onShow() {
    if (this.data._loaded) {
      this.loadData();
    }
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      await util.sleep(300);
      const slots     = this.generateMockSlots();
      const myBooking = util.getStorage('myBooking') || null;
      const nextWed   = util.getThisWednesdayNoon();
      this.setData({
        weekSlots: slots,
        myBooking,
        loading: false,
        _loaded: true,
        publishTime: util.formatDateTime(new Date(nextWed)),
      });
    } catch (e) {
      this.setData({ loading: false });
      util.showToast('加载失败，请重试');
    }
  },

  generateMockSlots() {
    const days  = ['周一','周二','周三','周四','周五'];
    const times = ['09:00-10:00','10:00-11:00','14:00-15:00','15:00-16:00'];
    const slots = [];
    let id = 1;
    const monday = this.getNextMonday();
    days.forEach((day, di) => {
      times.forEach(time => {
        const dateObj = new Date(monday);
        dateObj.setDate(monday.getDate() + di);
        const dateStr = util.formatDate(dateObj);
        const total   = Math.floor(Math.random() * 2) + 1;
        const booked  = Math.random() > 0.6 ? total : 0;
        slots.push({
          id: id++, day, date: dateStr, time, total, booked,
          remain: total - booked,
          status: booked >= total ? 'full' : 'available',
          startTs: new Date(`${dateStr} ${time.split('-')[0]}`).getTime(),
        });
      });
    });
    return slots;
  },

  getNextMonday() {
    const now  = new Date();
    const day  = now.getDay();
    const diff = day === 0 ? 1 : (8 - day);
    const mon  = new Date(now);
    mon.setDate(now.getDate() + diff);
    return mon;
  },

  toBooking(e) {
    const slot = e.currentTarget.dataset.slot;
    if (slot.status === 'full') { util.showToast('该时段已约满'); return; }
    if (this.data.myBooking)    { util.showToast('本周已有预约，不可重复预约'); return; }
    dd.navigateTo({
      url: `/pages/student/booking/booking?slotId=${slot.id}&date=${slot.date}&time=${slot.time}&day=${encodeURIComponent(slot.day)}`,
    });
  },

  viewMyBooking() {
    if (!this.data.myBooking) return;
    dd.navigateTo({ url: '/pages/student/checkin/checkin' });
  },

  cancelBooking() {
    const { myBooking } = this.data;
    if (!myBooking) return;
    if (!util.isMoreThanNHoursAway(myBooking.startTs, 12)) {
      dd.alert({
        title: '无法取消',
        content: '距上课不足12小时，无法取消预约。如不参加，将暂停您一周报名资格。',
        buttonText: '知道了',
      });
      return;
    }
    dd.confirm({
      title: '确认取消',
      content: `确认取消 ${myBooking.date} ${myBooking.time} 的预约吗？`,
      confirmButtonText: '确认取消',
      cancelButtonText: '再想想',
      success: (res) => {
        if (res.confirm) {
          util.removeStorage('myBooking');
          this.setData({ myBooking: null });
          util.showToast('已取消预约', 'success');
          this.loadData();
        }
      },
    });
  },
});
