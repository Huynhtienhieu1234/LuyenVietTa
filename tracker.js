// ===================================================================
// Website Visitor & Live Online Realtime Tracker Module
// Tác giả: KS. Huỳnh Tiến Hiểu
// ===================================================================

const TRACKER_CONFIG = {
  // Google Sheets Web App URL ghi nhận nhật ký người truy cập (Excel)
  GOOGLE_SHEETS_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbzxkSPYjt3sPfDuPwauUXi_z9XmmL2-w9UtHkZTvth5NH9M6qZ9-Nb644hr6w12xMj8/exec',
  // Thời gian duy trì trạng thái online của một tab (45 giây)
  HEARTBEAT_INTERVAL_MS: 15000,
  ONLINE_TIMEOUT_MS: 45000
};

class VisitorTracker {
  constructor() {
    this.tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    this.onlineInterval = null;
  }

  init() {
    this.initOnlinePresence();
    this.initVisitorCounter();
    this.logVisitorToGoogleSheets();
  }

  // -----------------------------------------------------------------
  // 1. LIVE ONLINE PRESENCE (SỐ NGƯỜI ĐANG TRUY CẬP TRỰC TIẾP)
  // -----------------------------------------------------------------
  initOnlinePresence() {
    const updatePresence = () => {
      try {
        let activeTabs = JSON.parse(localStorage.getItem('eng_active_online_tabs') || '{}');
        const now = Date.now();

        // Dọn dẹp các tab đã đóng (quá thời gian timeout)
        for (const id in activeTabs) {
          if (now - activeTabs[id] > TRACKER_CONFIG.ONLINE_TIMEOUT_MS) {
            delete activeTabs[id];
          }
        }

        // Ghi nhận nhịp tim (heartbeat) của tab hiện tại
        activeTabs[this.tabId] = now;
        localStorage.setItem('eng_active_online_tabs', JSON.stringify(activeTabs));

        const onlineCount = Math.max(1, Object.keys(activeTabs).length);
        this.renderOnlineCount(onlineCount);
      } catch (e) {
        this.renderOnlineCount(1);
      }
    };

    // Chạy nhịp tim đầu tiên
    updatePresence();

    // Định kỳ gửi nhịp tim mỗi 15 giây
    if (this.onlineInterval) clearInterval(this.onlineInterval);
    this.onlineInterval = setInterval(updatePresence, TRACKER_CONFIG.HEARTBEAT_INTERVAL_MS);

    // Lắng nghe sự kiện đồng bộ giữa các tab
    window.addEventListener('storage', (e) => {
      if (e.key === 'eng_active_online_tabs') {
        try {
          const activeTabs = JSON.parse(e.newValue || '{}');
          const now = Date.now();
          let count = 0;
          for (const id in activeTabs) {
            if (now - activeTabs[id] <= TRACKER_CONFIG.ONLINE_TIMEOUT_MS) count++;
          }
          this.renderOnlineCount(Math.max(1, count));
        } catch (err) {}
      }
    });

    // Dọn dẹp khi người dùng đóng tab
    window.addEventListener('beforeunload', () => {
      try {
        let activeTabs = JSON.parse(localStorage.getItem('eng_active_online_tabs') || '{}');
        delete activeTabs[this.tabId];
        localStorage.setItem('eng_active_online_tabs', JSON.stringify(activeTabs));
      } catch (e) {}
    });
  }

  renderOnlineCount(count) {
    const el = document.getElementById('val-online-users');
    if (el) el.textContent = count;
  }

  // -----------------------------------------------------------------
  // 2. VISITOR COUNTER (TỔNG LƯỢT TRUY CẬP - CHỐNG TĂNG KHI F5 / RELOAD)
  // -----------------------------------------------------------------
  initVisitorCounter() {
    const todayKey = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const storedDate = localStorage.getItem('eng_visit_last_date') || todayKey;
    let todayCount = parseInt(localStorage.getItem('eng_visit_today_count') || '1', 10);
    let totalCount = parseInt(localStorage.getItem('eng_visit_total_count') || '14', 10);

    // Nếu sang ngày mới -> reset số lượt của ngày hôm nay
    if (storedDate !== todayKey) {
      todayCount = 1;
      localStorage.setItem('eng_visit_last_date', todayKey);
      localStorage.setItem('eng_visit_today_count', '1');
    }

    // Kiểm tra xem đã có phiên làm việc trong tab này chưa
    const isNewSession = !sessionStorage.getItem('eng_visit_session_active');

    if (isNewSession) {
      // Đánh dấu phiên làm việc đã được tính lượt
      sessionStorage.setItem('eng_visit_session_active', 'true');

      // Chỉ tăng khi mở phiên mới, TUYỆT ĐỐI KHÔNG tăng khi F5 / Reload trang
      todayCount += 1;
      totalCount += 1;
      localStorage.setItem('eng_visit_today_count', todayCount.toString());
      localStorage.setItem('eng_visit_total_count', totalCount.toString());

      // Đồng bộ ngầm với máy chủ thống kê toàn cục
      this.syncGlobalVisitorCount(true);
    } else {
      // Đang reload lại trang: giữ nguyên số đếm
      this.syncGlobalVisitorCount(false);
    }

    this.renderTotalCount(totalCount);
  }

  async syncGlobalVisitorCount(isNewSession) {
    try {
      const pageUrl = window.location.origin + window.location.pathname;
      const res = await fetch('https://events.vercount.one/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pageUrl })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.site_pv || data.page_pv || data.site_uv)) {
          const serverTotal = Math.max(data.site_pv || 0, data.site_uv || 0);
          let currentTotal = parseInt(localStorage.getItem('eng_visit_total_count') || '14', 10);
          if (serverTotal > currentTotal) {
            currentTotal = serverTotal;
            localStorage.setItem('eng_visit_total_count', currentTotal.toString());
          }
          this.renderTotalCount(currentTotal);
        }
      }
    } catch (err) {
      // Hoạt động offline mượt mà
    }
  }

  renderTotalCount(total) {
    const el = document.getElementById('val-total-visitors');
    if (el) el.textContent = total;
  }

  // -----------------------------------------------------------------
  // 3. GOOGLE SHEETS ANALYTICS LOGGER (GHI LOG CHI TIẾT LÊN GOOGLE SHEETS)
  // -----------------------------------------------------------------
  async logVisitorToGoogleSheets() {
    const webAppUrl = TRACKER_CONFIG.GOOGLE_SHEETS_WEBAPP_URL || localStorage.getItem('eng_sheet_tracking_url') || '';

    if (!webAppUrl || webAppUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      return;
    }

    // Không spam nhiều dòng trong cùng 1 phiên làm việc
    if (sessionStorage.getItem('eng_visit_logged_session')) {
      return;
    }

    try {
      // 1. Nhận diện thiết bị
      const ua = navigator.userAgent || '';
      let device = 'Máy tính';
      if (/iPhone/i.test(ua)) device = '📱 iPhone (iOS)';
      else if (/iPad/i.test(ua)) device = '📱 iPad (iPadOS)';
      else if (/Android/i.test(ua)) device = '📱 Điện thoại (Android)';
      else if (/Macintosh|Mac OS X/i.test(ua)) device = '💻 Mac (macOS)';
      else if (/Windows NT 10.0/i.test(ua)) device = '💻 Windows 10/11';
      else if (/Windows/i.test(ua)) device = '💻 Windows PC';
      else if (/Linux/i.test(ua)) device = '💻 Linux PC';

      // 2. Nhận diện trình duyệt
      let browser = 'Khác';
      if (/CocCoc/i.test(ua)) browser = '🟢 Cốc Cốc';
      else if (/Edg/i.test(ua)) browser = '🔵 Microsoft Edge';
      else if (/Chrome/i.test(ua)) browser = '🔴 Google Chrome';
      else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = '🧭 Apple Safari';
      else if (/Firefox/i.test(ua)) browser = '🦊 Mozilla Firefox';
      else if (/Opera|OPR/i.test(ua)) browser = '🔴 Opera';

      // 3. Nguồn truy cập (Referrer)
      let referrer = document.referrer ? document.referrer : 'Trực tiếp / Bookmark';
      if (referrer.includes('facebook.com') || referrer.includes('fb.com')) referrer = '📘 Facebook';
      else if (referrer.includes('zalo.me')) referrer = '💬 Zalo';
      else if (referrer.includes('google.com')) referrer = '🔍 Google Search';
      else if (referrer.includes('github.io')) referrer = '🐙 GitHub Pages';

      // 4. Độ phân giải màn hình
      const screen = `${window.screen.width}x${window.screen.height} (${window.innerWidth}x${window.innerHeight})`;

      // 5. Lấy vị trí địa lý & IP
      let ip = 'Ẩn';
      let city = 'Không xác định';
      let country = 'Việt Nam';

      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          ip = ipData.ip || ip;
          city = ipData.city || city;
          country = ipData.country_name || country;
        }
      } catch (err) {
        try {
          const fbRes = await fetch('https://api.ipify.org?format=json');
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            ip = fbData.ip || ip;
          }
        } catch (e) {}
      }

      const payload = {
        ip: ip,
        city: city,
        country: country,
        device: device,
        browser: browser,
        referrer: referrer,
        screen: screen
      };

      // Gửi ngầm (không làm chậm trang web)
      await fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      sessionStorage.setItem('eng_visit_logged_session', 'true');
    } catch (e) {
      console.warn('Lỗi ghi nhận người truy cập:', e);
    }
  }
}

// Tự động khởi tạo ngay khi tài liệu sẵn sàng
window.visitorTracker = new VisitorTracker();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.visitorTracker.init());
} else {
  window.visitorTracker.init();
}
