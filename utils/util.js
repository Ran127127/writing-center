// utils/util.js —— 钉钉版（dd.* API）

/** 格式化日期 */
function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 格式化时间 HH:mm */
function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

/** 格式化完整日期时间 */
function formatDateTime(date) {
  return formatDate(date) + ' ' + formatTime(date);
}

/** 是否距目标时间超过 n 小时（未到截止）*/
function isMoreThanNHoursAway(targetTimestamp, n) {
  return (targetTimestamp - Date.now()) > n * 3600 * 1000;
}

/** 本周三 12:30 时间戳（若已过则返回下周三） */
function getThisWednesdayNoon() {
  const now  = new Date();
  const diff = (3 - now.getDay() + 7) % 7;
  const wed  = new Date(now);
  wed.setDate(now.getDate() + (diff === 0 ? 7 : diff));
  wed.setHours(12, 30, 0, 0);
  // 如果算出的是本周三但已过 12:30，返回下周三
  if (wed.getTime() <= now.getTime()) {
    wed.setDate(wed.getDate() + 7);
  }
  return wed.getTime();
}

/** 钉钉 toast */
function showToast(content, type = 'none', duration = 2000) {
  // type: 'success' | 'fail' | 'exception' | 'none'
  dd.showToast({ content, type, duration });
}

/** 简单延迟 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** 钉钉缓存读取（同步封装） */
function getStorage(key) {
  try {
    return dd.getStorageSync({ key }).data;
  } catch (e) {
    return null;
  }
}

/** 钉钉缓存写入 */
function setStorage(key, data) {
  dd.setStorageSync({ key, data });
}

/** 钉钉缓存删除 */
function removeStorage(key) {
  dd.removeStorageSync({ key });
}

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  isMoreThanNHoursAway,
  getThisWednesdayNoon,
  showToast,
  sleep,
  getStorage,
  setStorage,
  removeStorage,
};
