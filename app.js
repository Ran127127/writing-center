// app.js  —— 钉钉小程序版
App({
  globalData: {
    userInfo: null,       // { name, staffId, deptName, avatar, userId }
    userRole: '',         // 'student' | 'teacher' | 'admin'
    baseUrl: 'https://your-api-server.com/api', // 替换为实际接口地址
  },

  onLaunch(options) {
    // 读缓存
    const userInfo = dd.getStorageSync({ key: 'userInfo' }).data;
    const userRole  = dd.getStorageSync({ key: 'userRole'  }).data;
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.userRole = userRole || 'student';
    }
    // 企业内部应用：自动免登获取身份
    this.ddLogin();
  },

  // ─── 钉钉免登流程 ───────────────────────────────────────────
  ddLogin() {
    dd.getAuthCode({
      corpId: 'YOUR_CORP_ID',   // ← 替换为企业 corpId
      success: (res) => {
        const authCode = res.authCode;
        // 将 authCode 发给后端换 token + 用户信息
        // 后端通过钉钉服务端 API getUserInfoByCode 拿到 userId/名字/部门等
        this.request({
          url: '/auth/dingtalk',
          method: 'POST',
          data: { authCode },
        }).then((resp) => {
          if (resp && resp.data) {
            const { token, userInfo, userRole } = resp.data;
            dd.setStorageSync({ key: 'token',    data: token    });
            dd.setStorageSync({ key: 'userInfo', data: userInfo });
            dd.setStorageSync({ key: 'userRole', data: userRole });
            this.globalData.userInfo = userInfo;
            this.globalData.userRole = userRole;
          }
        }).catch(() => {
          // 离线调试时忽略
        });
      },
      fail: (err) => {
        console.warn('ddLogin fail', err);
      },
    });
  },

  // ─── 全局请求封装 ────────────────────────────────────────────
  request(options) {
    const token = (dd.getStorageSync({ key: 'token' }).data) || '';
    return new Promise((resolve, reject) => {
      dd.httpRequest({
        url: this.globalData.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          ...(options.headers || {}),
        },
        success(res) {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },
});
