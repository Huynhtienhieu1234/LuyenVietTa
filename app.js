// ===================================================================
// English Writing & Typing Practice Engine (Tối ưu hóa Luyện Viết)
// ===================================================================

class TypingApp {
  constructor() {
    this.currentCategory = 'all';
    this.currentIndex = 0;
    this.filteredTexts = [];
    this.currentPassage = null;
    this.savedCustomTexts = []; // Dữ liệu Luyện Viết

    // Speaking Data (Tách biệt với Luyện Viết)
    this.savedSpeakingTexts = []; // Dữ liệu Luyện Nói
    this.currentSpeakingPassage = null;
    this.currentSpeakingIndex = 0;

    // Typing State
    this.charElements = [];
    this.currentIndexInText = 0;
    this.typedHistory = [];
    this.totalTypedCount = 0;
    this.errorCount = 0;
    this.mistakeWords = new Set();
    this.isStarted = false;
    this.isFinished = false;

    // Timer
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedSeconds = 0;

    // Settings & Voice
    this.soundEnabled = true;
    this.autoSpeakWord = true; // Tự động phát âm từ gợi ý khi gõ
    this.isSpeaking = false;
    this.hintEnabled = true; // Bật / Tắt chữ gợi ý
    this.selectedVoiceGender = 'female'; // 'female' | 'male'
    this.availableVoices = [];
    this.fontSize = 1.35; // rem
    this.themeList = ['light', 'dark', 'cyberpunk', 'forest'];
    this.currentThemeIndex = 0;

    // Speaking State & Recorder
    this.currentMode = 'writing'; // 'writing' | 'speaking'
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.speechRecognition = null;
    this.lastSpokenTranscript = '';
    this.recordedAudioUrl = null;

    // DOM Elements
    this.dom = {
      // Mode Tabs
      tabBtnWriting: document.getElementById('tab-btn-writing'),
      tabBtnSpeaking: document.getElementById('tab-btn-speaking'),
      currentModeTag: document.getElementById('current-mode-tag'),
      statsRibbon: document.querySelector('.stats-ribbon'),

      // Typing Workspace
      typingContainer: document.getElementById('typing-container'),
      typingDisplay: document.getElementById('typing-display'),
      hiddenInput: document.getElementById('hidden-input'),
      customCaret: document.getElementById('custom-caret'),
      focusOverlay: document.getElementById('focus-overlay'),
      stageCard: document.getElementById('stage-card'),
      progressBarFill: document.getElementById('progress-bar-fill'),
      imeAlertBanner: document.getElementById('ime-alert-banner'),
      btnCloseImeAlert: document.getElementById('btn-close-ime-alert'),

      // Meta & Text Info
      passageLevel: document.getElementById('passage-level'),
      passageTitle: document.getElementById('passage-title'),
      btnDeleteCurrentCustom: document.getElementById('btn-delete-current-custom'),

      // Voice
      voiceGenderSelect: document.getElementById('voice-gender-select'),

      // Stats
      statWpm: document.getElementById('stat-wpm'),
      statAcc: document.getElementById('stat-acc'),
      statErrors: document.getElementById('stat-errors'),
      statTime: document.getElementById('stat-time'),

      // Controls & Submitted Texts
      selectSavedTexts: document.getElementById('select-saved-texts'),
      btnOpenManageModal: document.getElementById('btn-open-manage-modal'),
      myTextsCount: document.getElementById('my-texts-count'),
      btnToggleHint: document.getElementById('btn-toggle-hint'),
      btnSpeakAll: document.getElementById('btn-speak-all'),
      btnFontSizeInc: document.getElementById('btn-font-size-inc'),
      btnFontSizeDec: document.getElementById('btn-font-size-dec'),
      btnRandomText: document.getElementById('btn-random-text'),
      btnRestart: document.getElementById('btn-restart'),
      btnNext: document.getElementById('btn-next'),
      btnToggleSound: document.getElementById('btn-toggle-sound'),
      soundIcon: document.getElementById('sound-icon'),
      soundText: document.getElementById('sound-text'),
      btnThemeToggle: document.getElementById('btn-theme-toggle'),
      themeName: document.getElementById('theme-name'),

      // Speaking Workspace Elements
      speakingStageCard: document.getElementById('speaking-stage-card'),
      speakingRecorderPanel: document.getElementById('speaking-recorder-panel'),
      recTimerBadge: document.getElementById('rec-timer-badge'),
      recTimerText: document.getElementById('rec-timer-text'),
      visualizerWrapper: document.getElementById('visualizer-wrapper'),
      micVisualizerCanvas: document.getElementById('mic-visualizer-canvas'),
      liveVolumeFill: document.getElementById('live-volume-fill'),
      soundwaveAnimContainer: document.getElementById('soundwave-anim-container'),
      speakPassageLevel: document.getElementById('speak-passage-level'),
      speakPassageTitle: document.getElementById('speak-passage-title'),
      speakVoiceGenderSelect: document.getElementById('speak-voice-gender-select'),
      speakRateSelect: document.getElementById('speak-rate-select'),
      btnSpeakListenSample: document.getElementById('btn-speak-listen-sample'),
      speakingTargetText: document.getElementById('speaking-target-text'),
      btnRecordMic: document.getElementById('btn-record-mic'),
      btnSubmodeSample: document.getElementById('btn-submode-sample'),
      btnSubmodeFree: document.getElementById('btn-submode-free'),
      speakingScoreHeader: document.getElementById('speaking-score-header'),
      micIcon: document.getElementById('mic-icon'),
      micBtnText: document.getElementById('mic-btn-text'),
      recorderStatus: document.getElementById('recorder-status'),
      speakingResultPanel: document.getElementById('speaking-result-panel'),
      speakingScoreBadge: document.getElementById('speaking-score-badge'),
      speakingScoreVal: document.getElementById('speaking-score-val'),
      speakingScoreVerdict: document.getElementById('speaking-score-verdict'),
      recognizedContent: document.getElementById('recognized-content'),
      recordedAudioBox: document.getElementById('recorded-audio-box'),
      btnDlMp3: document.getElementById('btn-dl-mp3'),
      btnDlWav: document.getElementById('btn-dl-wav'),
      btnDlWebm: document.getElementById('btn-dl-webm'),
      userAudioPlayer: document.getElementById('user-audio-player'),

      // Manage Texts Modal
      manageTextsModal: document.getElementById('manage-texts-modal'),
      savedTextsListContainer: document.getElementById('saved-texts-list-container'),
      btnModalAddNew: document.getElementById('btn-modal-add-new'),
      btnDeleteAllCustom: document.getElementById('btn-delete-all-custom'),
      btnManageClose: document.getElementById('btn-manage-close'),

      // Result Modal
      resultModal: document.getElementById('result-modal'),
      resBadge: document.getElementById('res-badge'),
      resTitle: document.getElementById('res-title'),
      resSubtitle: document.getElementById('res-subtitle'),
      resWpm: document.getElementById('res-wpm'),
      resAcc: document.getElementById('res-acc'),
      resTime: document.getElementById('res-time'),
      resErrors: document.getElementById('res-errors'),
      resMistakesBox: document.getElementById('res-mistakes-box'),
      resMistakesList: document.getElementById('res-mistakes-list'),
      btnModalRetry: document.getElementById('btn-modal-retry'),
      btnModalNext: document.getElementById('btn-modal-next'),

      // Custom Text Modal (Nạp bài viết)
      btnCustomText: document.getElementById('btn-custom-text'),
      customTextModal: document.getElementById('custom-text-modal'),
      customTitleInput: document.getElementById('custom-title-input'),
      customTextInput: document.getElementById('custom-text-input'),
      btnCustomCancel: document.getElementById('btn-custom-cancel'),
      btnCustomApply: document.getElementById('btn-custom-apply'),

      // History & Streak
      historyTbody: document.getElementById('history-tbody'),
      btnClearHistory: document.getElementById('btn-clear-history'),
      streakCount: document.getElementById('streak-count'),

      // 2-Way Device Sync & Backup
      btnOpenSyncModal: document.getElementById('btn-open-sync-modal'),
      syncModal: document.getElementById('sync-modal'),
      btnSyncModalClose: document.getElementById('btn-sync-modal-close'),
      tabBtnExportCode: document.getElementById('tab-btn-export-code'),
      tabBtnImportCode: document.getElementById('tab-btn-import-code'),
      tabBtnFile: document.getElementById('tab-btn-file'),
      syncPaneExportCode: document.getElementById('sync-pane-export-code'),
      syncPaneImportCode: document.getElementById('sync-pane-import-code'),
      syncPaneFile: document.getElementById('sync-pane-file'),
      syncPinDisplay: document.getElementById('sync-pin-display'),
      btnCopySyncPin: document.getElementById('btn-copy-sync-pin'),
      syncCodeOutput: document.getElementById('sync-code-output'),
      btnCopySyncCode: document.getElementById('btn-copy-sync-code'),
      syncCodeInput: document.getElementById('sync-code-input'),
      btnApplySyncCode: document.getElementById('btn-apply-sync-code'),
      syncQrCode: document.getElementById('sync-qr-code'),
      btnExportBackup: document.getElementById('btn-export-backup'),
      btnTriggerImport: document.getElementById('btn-trigger-import'),
      backupFileInput: document.getElementById('backup-file-input'),
      toastContainer: document.getElementById('toast-container')
    };

    this.init();
  }

  init() {
    this.checkUrlSyncPayload();
    this.loadCustomTextsFromStorage();
    this.loadFilterTexts();
    this.loadSavedPreferences();
    this.initVoices();
    this.updateDailyStreak();
    this.renderHistory();
    this.bindEvents();
    this.loadPassage(0);
  }

  // =================================================================
  // 2-WAY SYNC VIA COMPACT CODE STRING & FILE BACKUP / RESTORE
  // =================================================================
  checkUrlSyncPayload() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#sync=')) {
      const rawPayload = hash.replace('#sync=', '');
      this.importFromCompactString(rawPayload, false);
      // Xóa hash trên thanh địa chỉ cho sạch sẽ
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  // Phương thức giải mã & nạp dữ liệu chung từ bất kỳ chuỗi mã nào
  importFromCompactString(inputStr, showAlertOnError = true) {
    if (!inputStr || !inputStr.trim()) {
      if (showAlertOnError) Notify.warning('Vui lòng dán đoạn mã đồng bộ vào ô.');
      return false;
    }

    let raw = inputStr.trim();
    // Bỏ tiền tố nếu có
    if (raw.startsWith('SYNC-')) raw = raw.substring(5);
    if (raw.includes('#sync=')) raw = raw.split('#sync=')[1];

    try {
      let data = null;

      // 1. Thử parse trực tiếp nếu chuỗi là JSON thuần (Array / Object)
      if (raw.startsWith('[') || raw.startsWith('{')) {
        try {
          data = JSON.parse(raw);
        } catch (e) {
          data = null;
        }
      }

      // 2. Nếu chưa parse được, thử giải nén bằng LZString hoặc decodeURI
      if (!data) {
        let jsonStr = '';
        if (typeof LZString !== 'undefined') {
          jsonStr = LZString.decompressFromBase64(raw) || 
                    LZString.decompressFromEncodedURIComponent(raw);
        }
        if (!jsonStr) {
          try {
            jsonStr = decodeURIComponent(raw);
          } catch (e) {
            jsonStr = raw;
          }
        }

        if (jsonStr) {
          data = JSON.parse(jsonStr);
        }
      }

      if (!data) {
        if (showAlertOnError) Notify.error('Đoạn mã không hợp lệ hoặc bị thiếu ký tự. Vui lòng sao chép lại toàn bộ đoạn mã!');
        return false;
      }

      let importedCount = 0;

      // Hỗ trợ Định dạng Tuple Array mới: [streak, [ [title, text, isPreserve], ... ]]
      if (Array.isArray(data) && Array.isArray(data[1])) {
        const streakVal = data[0];
        const textsList = data[1];

        textsList.forEach(item => {
          if (Array.isArray(item) && item[1]) {
            const title = item[0] || 'Bài học';
            const text = item[1];
            const isPreserve = item[2] === 1;

            if (!this.savedCustomTexts.some(t => t.text === text)) {
              const customItem = {
                id: 'sync_' + Date.now() + Math.random().toString(36).substr(2, 4),
                category: 'custom',
                title: title,
                topic: 'Bài của tôi',
                level: isPreserve ? 'Giữ dòng' : 'Viết ngang',
                formatMode: isPreserve ? 'preserve' : 'inline',
                text: text
              };
              this.savedCustomTexts.unshift(customItem);
              this.savedSpeakingTexts.unshift(customItem);
              importedCount++;
            }
          }
        });

        localStorage.setItem('eng_write_custom_texts', JSON.stringify(this.savedCustomTexts));
        localStorage.setItem('eng_speak_custom_texts', JSON.stringify(this.savedSpeakingTexts));

        if (streakVal) {
          const localStreak = parseInt(localStorage.getItem('eng_write_streak') || '0', 10);
          if (parseInt(streakVal) > localStreak) {
            localStorage.setItem('eng_write_streak', streakVal.toString());
            if (this.dom.streakCount) this.dom.streakCount.textContent = streakVal;
          }
        }
      } 
      // Hỗ trợ Định dạng Object cũ: { w: [...], s: [...], streak: ... }
      else if (data && typeof data === 'object') {
        const combined = [...(data.w || []), ...(data.s || [])];
        combined.forEach(item => {
          if (item && item.text && !this.savedCustomTexts.some(t => t.text === item.text)) {
            const customItem = {
              id: item.id || 'custom_' + Date.now() + Math.random().toString(36).substr(2, 4),
              category: 'custom',
              title: item.title || 'Bài chuyển sang',
              topic: 'Bài của tôi',
              level: item.level || 'Bài của tôi',
              formatMode: item.formatMode || 'inline',
              text: item.text
            };
            this.savedCustomTexts.unshift(customItem);
            this.savedSpeakingTexts.unshift(customItem);
            importedCount++;
          }
        });
        localStorage.setItem('eng_write_custom_texts', JSON.stringify(this.savedCustomTexts));
        localStorage.setItem('eng_speak_custom_texts', JSON.stringify(this.savedSpeakingTexts));

        if (data.streak) {
          const localStreak = parseInt(localStorage.getItem('eng_write_streak') || '0', 10);
          if (parseInt(data.streak) > localStreak) {
            localStorage.setItem('eng_write_streak', data.streak.toString());
            if (this.dom.streakCount) this.dom.streakCount.textContent = data.streak;
          }
        }
      }

      this.updateCustomTextsCount();
      this.populateSavedTextsDropdown();
      this.renderManageTextsList();
      this.loadFilterTexts();
      if (this.filteredTexts.length > 0) {
        this.loadPassage(0);
      }

      Notify.success(`🎉 Nạp thành công ${importedCount} bài học vào máy!`);
      return true;
    } catch (err) {
      if (showAlertOnError) Notify.error('Không thể đọc đoạn mã này. Hãy đảm bảo bạn đã sao chép đầy đủ toàn bộ đoạn mã: ' + err.message);
      return false;
    }
  }

  openSyncModal() {
    const hasTexts = this.savedCustomTexts.length > 0 || this.savedSpeakingTexts.length > 0;

    // Đóng gói dữ liệu tối giản dạng Tuple Array
    const streak = localStorage.getItem('eng_write_streak') || '1';
    
    // Gộp danh sách bài duy nhất theo nội dung
    const uniqueTexts = [];
    const seen = new Set();
    [...this.savedCustomTexts, ...this.savedSpeakingTexts].forEach(t => {
      if (t && t.text && !seen.has(t.text)) {
        seen.add(t.text);
        uniqueTexts.push([
          t.title || 'Bài học',
          t.text,
          t.formatMode === 'preserve' ? 1 : 0
        ]);
      }
    });

    const compactData = [parseInt(streak, 10), uniqueTexts];
    const jsonStr = JSON.stringify(compactData);

    if (hasTexts) {
      // 1. Tạo Mã PIN 6 Chữ Số Siêu Ngắn Gọn (Ví dụ: 849 201)
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      this.currentSyncPin = pin;

      if (this.dom.syncPinDisplay) {
        this.dom.syncPinDisplay.textContent = pin.slice(0, 3) + ' ' + pin.slice(3);
      }

      // Tải dữ liệu lên kênh PIN ntfy công khai (tự động lưu trong 24h, miễn phí 100%)
      try {
        fetch(`https://ntfy.sh/eng_sync_${pin}`, {
          method: 'POST',
          body: jsonStr,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }).catch(e => console.warn('PIN publish:', e));
      } catch (e) {}

      // 2. Nén Base64 cho ai thích sao chép chuỗi mã
      let syncCode = '';
      if (typeof LZString !== 'undefined') {
        syncCode = 'SYNC-' + LZString.compressToBase64(jsonStr);
      } else {
        syncCode = 'SYNC-' + btoa(unescape(encodeURIComponent(jsonStr)));
      }

      if (this.dom.syncCodeOutput) {
        this.dom.syncCodeOutput.value = syncCode;
      }

      // 3. Tạo mã QR cho ai thích quét
      if (this.dom.syncQrCode) {
        this.dom.syncQrCode.innerHTML = '';
        const urlEncoded = LZString.compressToEncodedURIComponent(jsonStr);
        const syncUrl = `${window.location.origin}${window.location.pathname}#sync=${urlEncoded}`;
        try {
          new QRCode(this.dom.syncQrCode, {
            text: syncUrl,
            width: 160,
            height: 160,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        } catch (err) {}
      }

      this.switchSyncTab('export');
    } else {
      // Khi chưa có bài nạp, mở ngay tab "Nhập mã (Nhận bài)" để người dùng nạp bài từ máy khác vào
      if (this.dom.syncPinDisplay) {
        this.dom.syncPinDisplay.textContent = 'Trống (0 bài)';
      }
      if (this.dom.syncCodeOutput) {
        this.dom.syncCodeOutput.value = '';
      }
      if (this.dom.syncQrCode) {
        this.dom.syncQrCode.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1rem;">Chưa có bài nào để tạo mã QR.</p>';
      }
      this.switchSyncTab('import');
    }

    this.dom.syncModal.classList.add('active');
  }

  switchSyncTab(tab) {
    if (tab === 'export') {
      this.dom.tabBtnExportCode.classList.add('active');
      this.dom.tabBtnImportCode.classList.remove('active');
      this.dom.tabBtnFile.classList.remove('active');
      this.dom.syncPaneExportCode.style.display = 'block';
      this.dom.syncPaneImportCode.style.display = 'none';
      this.dom.syncPaneFile.style.display = 'none';
    } else if (tab === 'import') {
      this.dom.tabBtnImportCode.classList.add('active');
      this.dom.tabBtnExportCode.classList.remove('active');
      this.dom.tabBtnFile.classList.remove('active');
      this.dom.syncPaneImportCode.style.display = 'block';
      this.dom.syncPaneExportCode.style.display = 'none';
      this.dom.syncPaneFile.style.display = 'none';
      setTimeout(() => {
        if (this.dom.syncCodeInput) this.dom.syncCodeInput.focus();
      }, 100);
    } else {
      this.dom.tabBtnFile.classList.add('active');
      this.dom.tabBtnExportCode.classList.remove('active');
      this.dom.tabBtnImportCode.classList.remove('active');
      this.dom.syncPaneFile.style.display = 'block';
      this.dom.syncPaneExportCode.style.display = 'none';
      this.dom.syncPaneImportCode.style.display = 'none';
    }
  }

  async applySyncCode() {
    const rawCode = (this.dom.syncCodeInput.value || '').trim();
    if (!rawCode) {
      Notify.warning('Vui lòng nhập mã 6 số (ví dụ: 849 201) hoặc dán đoạn mã đồng bộ.');
      if (this.dom.syncCodeInput) this.dom.syncCodeInput.focus();
      return;
    }

    // Trường hợp 1: Người dùng nhập Mã PIN 6 chữ số
    const cleanPin = rawCode.replace(/\D/g, '');
    if (cleanPin.length === 6 && !rawCode.startsWith('SYNC-')) {
      Notify.info(`⏳ Đang tìm và nạp dữ liệu từ mã số ${cleanPin}...`);
      try {
        // Đọc dữ liệu với since=24h để lấy đầy đủ tin nhắn trong 24 giờ qua
        const jsonResp = await fetch(`https://ntfy.sh/eng_sync_${cleanPin}/json?poll=1&since=24h`);
        if (!jsonResp.ok) throw new Error('Không thể kết nối máy chủ ntfy');
        
        const text = await jsonResp.text();
        const lines = text.trim().split('\n').filter(Boolean);
        
        let foundPayload = null;
        for (let i = lines.length - 1; i >= 0; i--) {
          try {
            const obj = JSON.parse(lines[i]);
            if (obj && obj.message) {
              foundPayload = obj.message;
              break;
            }
          } catch (e) {}
        }

        if (foundPayload) {
          const success = this.importFromCompactString(foundPayload, true);
          if (success) {
            this.dom.syncCodeInput.value = '';
            if (this.dom.syncModal) this.dom.syncModal.classList.remove('active');
            return;
          }
        }

        throw new Error('Mã PIN chưa có dữ liệu');
      } catch (err) {
        Notify.error(`Không tìm thấy dữ liệu cho mã số "${cleanPin}".\nHãy đảm bảo máy gửi đã bấm "🔄 Mã đồng bộ" và lấy mã mới nhất nhé!`);
        return;
      }
    }

    // Trường hợp 2: Người dùng dán chuỗi mã SYNC-... hoặc mã nén
    const success = this.importFromCompactString(rawCode, true);
    if (success) {
      this.dom.syncCodeInput.value = '';
      if (this.dom.syncModal) this.dom.syncModal.classList.remove('active');
    }
  }

  exportBackupData() {
    const backupObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      streak: localStorage.getItem('eng_write_streak') || '1',
      writingTexts: this.savedCustomTexts,
      speakingTexts: this.savedSpeakingTexts
    };

    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const filename = `English_Lessons_Backup_${new Date().toISOString().slice(0, 10)}.json`;

    this.triggerBlobDownload(blob, filename);
    Notify.success('💾 Đã xuất file sao lưu bài học thành công!');
  }

  importBackupData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        let count = 0;

        if (Array.isArray(data.writingTexts)) {
          const currentWriting = this.savedCustomTexts;
          data.writingTexts.forEach(t => {
            if (!currentWriting.some(item => item.id === t.id || item.text === t.text)) {
              currentWriting.unshift(t);
              count++;
            }
          });
          this.savedCustomTexts = currentWriting;
          localStorage.setItem('eng_write_custom_texts', JSON.stringify(this.savedCustomTexts));
        }

        if (Array.isArray(data.speakingTexts)) {
          const currentSpeaking = this.savedSpeakingTexts;
          data.speakingTexts.forEach(t => {
            if (!currentSpeaking.some(item => item.id === t.id || item.text === t.text)) {
              currentSpeaking.unshift(t);
              count++;
            }
          });
          this.savedSpeakingTexts = currentSpeaking;
          localStorage.setItem('eng_speak_custom_texts', JSON.stringify(this.savedSpeakingTexts));
        }

        if (data.streak) {
          const currentStreak = parseInt(localStorage.getItem('eng_write_streak') || '0', 10);
          if (parseInt(data.streak) > currentStreak) {
            localStorage.setItem('eng_write_streak', data.streak.toString());
            this.dom.streakCount.textContent = data.streak;
          }
        }

        this.updateCustomTextsCount();
        this.populateSavedTextsDropdown();
        this.renderManageTextsList();
        this.loadFilterTexts();
        this.loadPassage(0);

        if (this.dom.syncModal) this.dom.syncModal.classList.remove('active');
        Notify.success(`✅ Đã khôi phục thành công ${count} bài nạp vào máy!`);
      } catch (err) {
        Notify.error('File sao lưu không hợp lệ hoặc bị lỗi: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  showToast(message, type = 'success') {
    if (window.Notify) {
      window.Notify.toast(message, type);
    }
  }

  // =================================================================
  // Custom Texts Storage & Management (Tách biệt Viết & Nói)
  // =================================================================
  loadCustomTextsFromStorage() {
    // 1. Load Writing Texts
    try {
      const writeData = localStorage.getItem('eng_write_custom_texts');
      this.savedCustomTexts = writeData ? JSON.parse(writeData) : [];
    } catch (e) {
      this.savedCustomTexts = [];
    }

    // 2. Load Speaking Texts
    try {
      const speakData = localStorage.getItem('eng_speak_custom_texts');
      this.savedSpeakingTexts = speakData ? JSON.parse(speakData) : [];
    } catch (e) {
      this.savedSpeakingTexts = [];
    }

    if (this.savedSpeakingTexts.length > 0 && !this.currentSpeakingPassage) {
      this.currentSpeakingPassage = this.savedSpeakingTexts[0];
    }

    this.updateCustomTextsCount();
    this.populateSavedTextsDropdown();
  }

  saveCustomText(customItem, persist = true) {
    if (persist) {
      // 1. Lưu vào danh sách Luyện Viết
      const existingWritingIdx = this.savedCustomTexts.findIndex(t => t.id === customItem.id);
      if (existingWritingIdx >= 0) {
        this.savedCustomTexts[existingWritingIdx] = customItem;
      } else {
        this.savedCustomTexts.unshift(customItem);
      }
      localStorage.setItem('eng_write_custom_texts', JSON.stringify(this.savedCustomTexts));

      // 2. Lưu đồng thời vào danh sách Luyện Nói để dùng chung ngay lập tức
      const existingSpeakingIdx = this.savedSpeakingTexts.findIndex(t => t.id === customItem.id);
      if (existingSpeakingIdx >= 0) {
        this.savedSpeakingTexts[existingSpeakingIdx] = customItem;
      } else {
        this.savedSpeakingTexts.unshift(customItem);
      }
      localStorage.setItem('eng_speak_custom_texts', JSON.stringify(this.savedSpeakingTexts));
    }

    this.updateCustomTextsCount();
    this.populateSavedTextsDropdown();
    this.renderManageTextsList();

    if (this.currentMode === 'speaking') {
      this.currentSpeakingPassage = customItem;
      this.updateSpeakingStage();
    } else {
      this.currentPassage = customItem;
      this.loadFilterTexts();
      const idx = this.filteredTexts.findIndex(t => t.id === customItem.id);
      this.loadPassage(idx >= 0 ? idx : 0);
    }
  }

  async deleteCustomText(id) {
    const ok = await Notify.confirm(
      'Bạn có chắc muốn xóa bài này khỏi danh sách lưu trữ không?',
      'Xác nhận xóa bài',
      { isDanger: true, confirmText: '🗑️ Xóa bài', cancelText: 'Hủy' }
    );
    if (!ok) return;
    
    // Xóa khỏi cả Viết và Nói
    this.savedSpeakingTexts = this.savedSpeakingTexts.filter(t => t.id !== id);
    localStorage.setItem('eng_speak_custom_texts', JSON.stringify(this.savedSpeakingTexts));
    
    this.savedCustomTexts = this.savedCustomTexts.filter(t => t.id !== id);
    localStorage.setItem('eng_write_custom_texts', JSON.stringify(this.savedCustomTexts));
    
    this.updateCustomTextsCount();
    this.populateSavedTextsDropdown();
    this.renderManageTextsList();

    if (this.currentMode === 'speaking') {
      this.currentSpeakingIndex = 0;
      this.currentSpeakingPassage = this.savedSpeakingTexts[0] || null;
      this.updateSpeakingStage();
    } else {
      this.loadFilterTexts();
      this.loadPassage(0);
    }

    Notify.success('Đã xóa bài học khỏi danh sách!');
  }

  updateCustomTextsCount() {
    if (this.dom.myTextsCount) {
      const count = this.currentMode === 'speaking' ? this.savedSpeakingTexts.length : this.savedCustomTexts.length;
      this.dom.myTextsCount.textContent = count;
    }
  }

  populateSavedTextsDropdown() {
    if (!this.dom.selectSavedTexts) return;
    const select = this.dom.selectSavedTexts;
    select.innerHTML = '';

    const list = this.currentMode === 'speaking' ? this.savedSpeakingTexts : this.savedCustomTexts;

    if (list.length === 0) {
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = this.currentMode === 'speaking' 
        ? '-- Chưa có bài luyện nói (Hãy nạp bài mới) --' 
        : '-- Chưa có bài luyện viết (Hãy nạp bài mới) --';
      emptyOpt.disabled = true;
      emptyOpt.selected = true;
      select.appendChild(emptyOpt);
      return;
    }

    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `📝 ${item.title}`;
      select.appendChild(opt);
    });

    // Update active value
    if (this.currentMode === 'speaking') {
      if (this.currentSpeakingPassage) {
        select.value = this.currentSpeakingPassage.id;
      }
    } else {
      if (this.currentPassage) {
        select.value = this.currentPassage.id;
      }
    }
  }

  renderManageTextsList() {
    if (!this.dom.savedTextsListContainer) return;
    const container = this.dom.savedTextsListContainer;
    const isSpeak = this.currentMode === 'speaking';
    const list = isSpeak ? this.savedSpeakingTexts : this.savedCustomTexts;
    const activeItem = isSpeak ? this.currentSpeakingPassage : this.currentPassage;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-saved-box">
          <div class="icon">📂</div>
          <p><strong>Bạn chưa lưu bài ${isSpeak ? 'luyện nói' : 'luyện viết'} nào.</strong></p>
          <p style="font-size: 0.85rem; margin-top: 0.25rem;">Hãy bấm nút <strong>"➕ Nạp thêm bài"</strong> để dán đoạn văn tiếng Anh cần ${isSpeak ? 'nói' : 'viết'}!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((item, idx) => {
      const isCurrent = activeItem && activeItem.id === item.id;
      const wordCount = item.text.trim().split(/\s+/).length;
      return `
        <div class="saved-text-card ${isCurrent ? 'is-current' : ''}">
          <div class="saved-text-meta">
            <div class="saved-text-title">
              <span>${idx + 1}. ${item.title}</span>
              ${isCurrent ? '<span class="badge badge-level" style="font-size: 0.65rem;">Đang chọn</span>' : ''}
            </div>
            <div class="saved-text-preview">
              ${item.text.slice(0, 75)}... (${wordCount} từ)
            </div>
          </div>
          <div class="saved-text-actions">
            <button class="btn-action btn-primary btn-select-saved-item" data-id="${item.id}" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
              ${isSpeak ? '🎙️ Luyện bài này' : '✍️ Luyện bài này'}
            </button>
            <button class="btn-tool btn-delete-saved-item" data-id="${item.id}" style="color: var(--danger-color); width: 32px; height: 32px;" title="Xóa bài này">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind item buttons
    container.querySelectorAll('.btn-select-saved-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.selectTextById(id);
        this.dom.manageTextsModal.classList.remove('active');
      });
    });

    container.querySelectorAll('.btn-delete-saved-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.deleteCustomText(id);
      });
    });
  }

  selectTextById(id) {
    if (this.currentMode === 'speaking') {
      const targetIdx = this.savedSpeakingTexts.findIndex(t => t.id === id);
      if (targetIdx >= 0) {
        this.loadSpeakingPassage(targetIdx);
        if (this.dom.selectSavedTexts) {
          this.dom.selectSavedTexts.value = id;
        }
      }
    } else {
      const targetIdx = this.savedCustomTexts.findIndex(t => t.id === id);
      if (targetIdx >= 0) {
        this.filteredTexts = [...this.savedCustomTexts];
        this.loadPassage(targetIdx);
        if (this.dom.selectSavedTexts) {
          this.dom.selectSavedTexts.value = id;
        }
      }
    }
  }

  loadSpeakingPassage(index) {
    this.stopSpeech();
    if (this.isRecording) this.stopRecording();

    if (this.savedSpeakingTexts.length === 0) {
      this.currentSpeakingPassage = null;
      this.updateSpeakingStage();
      return;
    }

    if (index >= this.savedSpeakingTexts.length) index = 0;
    if (index < 0) index = this.savedSpeakingTexts.length - 1;
    this.currentSpeakingIndex = index;
    this.currentSpeakingPassage = this.savedSpeakingTexts[this.currentSpeakingIndex];

    if (this.dom.selectSavedTexts && this.currentSpeakingPassage) {
      this.dom.selectSavedTexts.value = this.currentSpeakingPassage.id;
    }
    this.updateSpeakingStage();
  }

  // =================================================================
  // Web Speech API & Voice Selection (Nam / Nữ)
  // =================================================================
  initVoices() {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        this.availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      }
    };
    updateVoices();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  getVoice(gender) {
    if (!this.availableVoices.length && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    }

    const femaleKeywords = ['female', 'zira', 'samantha', 'victoria', 'karen', 'fiona', 'catherine', 'susan', 'jenny', 'aria'];
    const maleKeywords = ['male', 'david', 'mark', 'george', 'daniel', 'oliver', 'guy', 'ryan', 'alex'];

    if (gender === 'male') {
      const match = this.availableVoices.find(v => {
        const name = v.name.toLowerCase();
        return maleKeywords.some(k => name.includes(k)) && !femaleKeywords.some(k => name.includes(k));
      });
      if (match) return { voice: match, pitch: 0.95 };
      // Fallback: use first english voice with lower pitch
      return { voice: this.availableVoices[0] || null, pitch: 0.85 };
    } else {
      // Female default
      const match = this.availableVoices.find(v => {
        const name = v.name.toLowerCase();
        return femaleKeywords.some(k => name.includes(k));
      });
      if (match) return { voice: match, pitch: 1.05 };
      // Fallback: use first english voice with slightly higher pitch
      return { voice: this.availableVoices[0] || null, pitch: 1.15 };
    }
  }

  toggleSpeakPassage() {
    if (this.isSpeaking) {
      this.stopSpeech();
      return;
    }
    if (this.currentPassage) {
      this.speakText(this.currentPassage.text);
    }
  }

  speakText(text, rate = 0.95) {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng phát âm Text-to-Speech.');
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    const { voice, pitch } = this.getVoice(this.selectedVoiceGender);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;

    this.isSpeaking = true;
    this.dom.btnSpeakAll.classList.add('active');
    this.dom.btnSpeakAll.textContent = '⏹️ Dừng';

    utterance.onend = () => {
      this.isSpeaking = false;
      this.dom.btnSpeakAll.classList.remove('active');
      this.dom.btnSpeakAll.textContent = '🔊 Phát âm';
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.dom.btnSpeakAll.classList.remove('active');
      this.dom.btnSpeakAll.textContent = '🔊 Phát âm';
    };

    window.speechSynthesis.speak(utterance);
  }

  speakWord(word) {
    if (!this.autoSpeakWord || !this.soundEnabled || !word) return;
    const clean = word.toLowerCase().replace(/[^a-z0-9']/g, '').trim();
    if (!clean || clean.length === 0) return;

    if ('speechSynthesis' in window) {
      // Don't interrupt full passage playback if user explicitly clicked Speak All
      if (this.isSpeaking) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;

      const { voice, pitch } = this.getVoice(this.selectedVoiceGender);
      if (voice) utterance.voice = voice;
      utterance.pitch = pitch;

      window.speechSynthesis.speak(utterance);
    }
  }

  getWordAtCharIndex(charIndex) {
    if (!this.currentPassage || !this.currentPassage.text) return '';
    const text = this.currentPassage.text;
    if (charIndex < 0 || charIndex >= text.length) return '';

    let start = charIndex;
    while (start > 0 && !/\s/.test(text[start - 1])) {
      start--;
    }
    let end = charIndex;
    while (end < text.length && !/\s/.test(text[end])) {
      end++;
    }
    return text.substring(start, end).replace(/[^\w'-]/g, '').trim();
  }

  getCompletedWordBeforeIndex(charIndex) {
    if (!this.currentPassage || !this.currentPassage.text) return '';
    const text = this.currentPassage.text;
    let idx = charIndex - 1;
    while (idx >= 0 && /\s/.test(text[idx])) {
      idx--;
    }
    if (idx < 0) return '';
    let end = idx + 1;
    let start = idx;
    while (start > 0 && !/\s/.test(text[start - 1])) {
      start--;
    }
    return text.substring(start, end).replace(/[^\w'-]/g, '').trim();
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.dom.btnSpeakAll.classList.remove('active');
    this.dom.btnSpeakAll.textContent = '🔊 Phát âm';
    if (this.dom.btnSpeakListenSample) {
      this.dom.btnSpeakListenSample.classList.remove('active');
      this.dom.btnSpeakListenSample.textContent = '🔊 Nghe mẫu';
    }
  }

  // =================================================================
  // Speaking Mode & Voice Recording System (Luyện Nói Tiếng Anh)
  // =================================================================
  switchMode(mode) {
    this.currentMode = mode;
    this.stopSpeech();
    if (this.isRecording) {
      this.stopRecording();
    }

    // Đảm bảo cả Viết và Nói luôn có đầy đủ bài nạp
    if (this.savedSpeakingTexts.length === 0 && this.savedCustomTexts.length > 0) {
      this.savedSpeakingTexts = [...this.savedCustomTexts];
      localStorage.setItem('eng_speak_custom_texts', JSON.stringify(this.savedSpeakingTexts));
    }
    if (this.savedCustomTexts.length === 0 && this.savedSpeakingTexts.length > 0) {
      this.savedCustomTexts = [...this.savedSpeakingTexts];
      localStorage.setItem('eng_write_custom_texts', JSON.stringify(this.savedCustomTexts));
    }

    this.updateCustomTextsCount();
    this.populateSavedTextsDropdown();

    if (mode === 'speaking') {
      this.dom.tabBtnSpeaking.classList.add('active');
      this.dom.tabBtnWriting.classList.remove('active');
      this.dom.stageCard.style.display = 'none';
      if (this.dom.statsRibbon) this.dom.statsRibbon.style.display = 'none';
      this.dom.speakingStageCard.style.display = 'block';
      this.dom.currentModeTag.innerHTML = '🎙️ <strong>Chế độ Luyện Nói Tiếng Anh</strong>';

      if (this.savedSpeakingTexts.length > 0 && !this.currentSpeakingPassage) {
        this.currentSpeakingPassage = this.savedSpeakingTexts[0];
      }
      if (this.dom.selectSavedTexts && this.currentSpeakingPassage) {
        this.dom.selectSavedTexts.value = this.currentSpeakingPassage.id;
      }
      this.updateSpeakingStage();
    } else {
      this.dom.tabBtnWriting.classList.add('active');
      this.dom.tabBtnSpeaking.classList.remove('active');
      this.dom.stageCard.style.display = 'block';
      if (this.dom.statsRibbon) this.dom.statsRibbon.style.display = 'grid';
      this.dom.speakingStageCard.style.display = 'none';
      this.dom.currentModeTag.innerHTML = '✍️ <strong>Chế độ Luyện Viết Chuẩn</strong>';

      this.loadFilterTexts();
      if (this.currentSpeakingPassage) {
        const matchingWritingIdx = this.filteredTexts.findIndex(t => t.id === this.currentSpeakingPassage.id || t.text === this.currentSpeakingPassage.text);
        if (matchingWritingIdx >= 0) {
          this.loadPassage(matchingWritingIdx);
        } else {
          this.loadPassage(0);
        }
      } else {
        this.loadPassage(0);
      }
      this.focusInput();
    }
  }

  selectSpeakingPassage(index) {
    if (index >= 0 && index < this.savedSpeakingTexts.length) {
      this.currentSpeakingIndex = index;
      this.currentSpeakingPassage = this.savedSpeakingTexts[this.currentSpeakingIndex];
      if (this.dom.selectSavedTexts && this.currentSpeakingPassage) {
        this.dom.selectSavedTexts.value = this.currentSpeakingPassage.id;
      }
      this.updateSpeakingStage();
    }
  }

  updateSpeakingStage() {
    if (!this.currentSpeakingPassage) {
      this.dom.speakingTargetText.innerHTML = `
        <div class="empty-saved-box">
          <p><strong>Bạn chưa nạp bài luyện nói nào.</strong></p>
        </div>
      `;
      return;
    }

    this.dom.speakingTargetText.textContent = this.currentSpeakingPassage.text;
    this.dom.speakingResultPanel.style.display = 'none';
    this.dom.recordedAudioBox.style.display = 'none';
    this.dom.recorderStatus.textContent = 'Nhấn nút micro ở trên, cho phép truy cập micro và đọc to đoạn văn bên trái.';
  }

  speakSpeakingSample() {
    if (!this.currentSpeakingPassage) {
      Notify.warning('Chưa có bài luyện nói nào để phát âm mẫu. Hãy nạp bài mới!');
      return;
    }
    if (this.isSpeaking) {
      this.stopSpeech();
      return;
    }

    const rate = parseFloat(this.dom.speakRateSelect.value || '1.0');
    const gender = this.dom.speakVoiceGenderSelect.value || 'female';

    if (!('speechSynthesis' in window)) {
      Notify.warning('Trình duyệt của bạn không hỗ trợ tính năng phát âm Text-to-Speech.');
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(this.currentSpeakingPassage.text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    const { voice, pitch } = this.getVoice(gender);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;

    this.isSpeaking = true;
    this.dom.btnSpeakListenSample.classList.add('active');
    this.dom.btnSpeakListenSample.textContent = '⏹️ Dừng đọc mẫu';

    utterance.onend = () => {
      this.isSpeaking = false;
      this.dom.btnSpeakListenSample.classList.remove('active');
      this.dom.btnSpeakListenSample.textContent = '🔊 Nghe mẫu';
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.dom.btnSpeakListenSample.classList.remove('active');
      this.dom.btnSpeakListenSample.textContent = '🔊 Nghe mẫu';
    };

    window.speechSynthesis.speak(utterance);
  }

  // Live Microphone Recording & Speech-to-Text Recognition
  switchSpeakingSubmode(mode) {
    this.speakingSubMode = mode;
    if (mode === 'free') {
      if (this.dom.btnSubmodeFree) this.dom.btnSubmodeFree.classList.add('active');
      if (this.dom.btnSubmodeSample) this.dom.btnSubmodeSample.classList.remove('active');
      if (this.dom.speakingScoreHeader) this.dom.speakingScoreHeader.style.display = 'none';
      if (this.dom.recorderStatus) {
        this.dom.recorderStatus.textContent = '🎙️ Chế độ thu âm tự do: Bấm "Bấm để nói" để ghi âm bài nói, thuyết trình hoặc podcast của bạn!';
      }
    } else {
      if (this.dom.btnSubmodeSample) this.dom.btnSubmodeSample.classList.add('active');
      if (this.dom.btnSubmodeFree) this.dom.btnSubmodeFree.classList.remove('active');
      if (this.dom.speakingScoreHeader) this.dom.speakingScoreHeader.style.display = 'flex';
      if (this.dom.recorderStatus) {
        this.dom.recorderStatus.textContent = 'Nhấn nút micro ở trên, cho phép truy cập micro và đọc to đoạn văn mẫu bên trái.';
      }
    }
  }

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    if (this.speakingSubMode === 'sample' && !this.currentSpeakingPassage) {
      Notify.warning('Vui lòng nạp hoặc chọn một bài luyện nói tiếng Anh trước khi thu âm!');
      return;
    }

    try {
      this.audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micStream = stream;
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.lastRecordedBlob = audioBlob;
        if (this.recordedAudioUrl) URL.revokeObjectURL(this.recordedAudioUrl);
        this.recordedAudioUrl = URL.createObjectURL(audioBlob);
        if (this.dom.userAudioPlayer) this.dom.userAudioPlayer.src = this.recordedAudioUrl;
        if (this.dom.recordedAudioBox) this.dom.recordedAudioBox.style.display = 'block';
        if (this.micStream) this.micStream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.startAudioVisualizer(stream);

      this.recSeconds = 0;
      if (this.dom.recTimerText) this.dom.recTimerText.textContent = 'REC 00:00';
      if (this.dom.recTimerBadge) this.dom.recTimerBadge.style.display = 'inline-flex';
      if (this.dom.visualizerWrapper) this.dom.visualizerWrapper.style.display = 'flex';
      if (this.dom.soundwaveAnimContainer) this.dom.soundwaveAnimContainer.style.display = 'flex';
      if (this.dom.speakingRecorderPanel) this.dom.speakingRecorderPanel.classList.add('is-active-recording');

      if (this.recTimerInterval) clearInterval(this.recTimerInterval);
      this.recTimerInterval = setInterval(() => {
        this.recSeconds++;
        const mins = String(Math.floor(this.recSeconds / 60)).padStart(2, '0');
        const secs = String(this.recSeconds % 60).padStart(2, '0');
        if (this.dom.recTimerText) this.dom.recTimerText.textContent = `REC ${mins}:${secs}`;
      }, 1000);

      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.speechRecognition = new SpeechRecognitionClass();
        this.speechRecognition.lang = 'en-US';
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.lastSpokenTranscript = '';
        this.speechRecognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript + ' ';
          this.lastSpokenTranscript = transcript.trim();
          if (this.dom.recorderStatus) {
            this.dom.recorderStatus.textContent = `🎙️ Đang nghe: "${this.lastSpokenTranscript}"`;
          }
        };
        this.speechRecognition.start();
      }

      this.isRecording = true;
      if (this.dom.btnRecordMic) this.dom.btnRecordMic.classList.add('is-recording');
      if (this.dom.micBtnText) this.dom.micBtnText.textContent = '⏹️ Dừng thu âm';
      if (this.dom.recorderStatus) {
        this.dom.recorderStatus.textContent = this.speakingSubMode === 'free'
          ? '🎙️ Đang thu âm tự do... Hãy nói thoải mái!'
          : '🎙️ Đang thu âm & nhận diện giọng nói... Hãy đọc to đoạn văn tiếng Anh bên trái!';
      }
    } catch (err) {
      Notify.error('Không thể truy cập Microphone. Vui lòng cho phép quyền truy cập Micro trên trình duyệt để sử dụng tính năng thu âm.');
      console.error(err);
    }
  }

  startAudioVisualizer(stream) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.micAudioCtx = new AudioCtx();
      this.micAnalyser = this.micAudioCtx.createAnalyser();
      this.micAnalyser.fftSize = 256;
      this.micSource = this.micAudioCtx.createMediaStreamSource(stream);
      this.micSource.connect(this.micAnalyser);

      const canvas = this.dom.micVisualizerCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const bufferLength = this.micAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!this.isRecording) return;
        this.visualizerAnimId = requestAnimationFrame(draw);
        this.micAnalyser.getByteFrequencyData(dataArray);

        // Calculate volume for VU meter
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avg = sum / bufferLength;
        const volumePercent = Math.min(100, Math.round((avg / 128) * 100));
        if (this.dom.liveVolumeFill) {
          this.dom.liveVolumeFill.style.width = `${volumePercent}%`;
        }

        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.2;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          ctx.fillStyle = `rgb(239, ${68 + dataArray[i]}, ${68 + dataArray[i] * 1.5})`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      };
      draw();
    } catch (e) {
      console.warn('Audio Visualizer not supported:', e);
    }
  }

  stopRecording() {
    this.isRecording = false;
    if (this.dom.btnRecordMic) this.dom.btnRecordMic.classList.remove('is-recording');
    if (this.dom.micBtnText) this.dom.micBtnText.textContent = 'Bấm để nói (Record)';
    if (this.dom.recorderStatus) {
      this.dom.recorderStatus.textContent = '✅ Đã hoàn thành thu âm. Bạn có thể nghe lại và tải file âm thanh (MP3, WAV, WebM) bên dưới!';
    }

    if (this.recTimerInterval) {
      clearInterval(this.recTimerInterval);
      this.recTimerInterval = null;
    }
    if (this.visualizerAnimId) {
      cancelAnimationFrame(this.visualizerAnimId);
      this.visualizerAnimId = null;
    }
    if (this.micAudioCtx && this.micAudioCtx.state !== 'closed') {
      try { this.micAudioCtx.close(); } catch (e) {}
    }

    if (this.dom.recTimerBadge) this.dom.recTimerBadge.style.display = 'none';
    if (this.dom.visualizerWrapper) this.dom.visualizerWrapper.style.display = 'none';
    if (this.dom.soundwaveAnimContainer) this.dom.soundwaveAnimContainer.style.display = 'none';
    if (this.dom.speakingRecorderPanel) this.dom.speakingRecorderPanel.classList.remove('is-active-recording');

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {}
    }

    setTimeout(() => {
      this.evaluatePronunciation(this.lastSpokenTranscript);
    }, 300);
  }

  evaluatePronunciation(spokenText) {
    if (this.dom.speakingResultPanel) this.dom.speakingResultPanel.style.display = 'flex';
    if (this.speakingSubMode === 'free') {
      if (this.dom.speakingScoreHeader) this.dom.speakingScoreHeader.style.display = 'none';
      if (this.dom.recognizedContent) {
        this.dom.recognizedContent.innerHTML = spokenText
          ? `<p style="font-size: 1.05rem; line-height: 1.6; color: var(--text-main); font-weight: 500;">${spokenText}</p>`
          : '<span style="color: var(--text-muted); font-style: italic;">(Chưa phát hiện giọng nói rõ ràng)</span>';
      }
      return;
    }

    if (this.dom.speakingScoreHeader) this.dom.speakingScoreHeader.style.display = 'flex';

    if (!spokenText) {
      if (this.dom.speakingScoreVal) this.dom.speakingScoreVal.textContent = '0%';
      if (this.dom.speakingScoreBadge) this.dom.speakingScoreBadge.style.color = 'var(--danger-color)';
      if (this.dom.speakingScoreVerdict) this.dom.speakingScoreVerdict.textContent = 'Chưa nhận diện được giọng nói tiếng Anh. Hãy thử lại gần micro hơn nhé!';
      if (this.dom.recognizedContent) {
        this.dom.recognizedContent.innerHTML = '<span style="color: var(--text-muted); font-style: italic;">(Không có giọng nói nào được nhận diện)</span>';
      }
      return;
    }

    if (!this.currentSpeakingPassage) return;

    const clean = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
    const targetWords = clean(this.currentSpeakingPassage.text);
    const spokenWords = clean(spokenText);

    let matchCount = 0;
    const recognizedHtml = spokenWords.map(word => {
      if (targetWords.includes(word)) {
        matchCount++;
        return `<span class="word-match">${word}</span>`;
      } else {
        return `<span class="word-missed">${word}</span>`;
      }
    }).join(' ');

    const score = Math.min(100, Math.round((matchCount / Math.max(targetWords.length, 1)) * 100));

    if (this.dom.speakingScoreVal) this.dom.speakingScoreVal.textContent = `${score}%`;
    if (this.dom.recognizedContent) this.dom.recognizedContent.innerHTML = recognizedHtml;

    if (this.dom.speakingScoreBadge && this.dom.speakingScoreVerdict) {
      if (score >= 80) {
        this.dom.speakingScoreBadge.style.color = 'var(--success-color)';
        this.dom.speakingScoreVerdict.textContent = '🌟 Xuất sắc! Phát âm và độ chính xác rất chuẩn!';
      } else if (score >= 50) {
        this.dom.speakingScoreBadge.style.color = 'var(--warning-color)';
        this.dom.speakingScoreVerdict.textContent = '👍 Khá tốt! Hãy nghe lại bản mẫu và luyện thêm các từ gạch chân đỏ nhé.';
      } else {
        this.dom.speakingScoreBadge.style.color = 'var(--danger-color)';
        this.dom.speakingScoreVerdict.textContent = '💪 Cố lên! Hãy nghe phát âm mẫu ở trên và đọc lại từng từ rõ ràng hơn nhé.';
      }
    }
  }

  async downloadAudioFormat(format) {
    if (!this.lastRecordedBlob) {
      Notify.warning('Chưa có bản ghi âm nào để tải về. Hãy thu âm trước nhé!');
      return;
    }

    const filename = `speaking_audio_${Date.now()}.${format}`;
    this.showToast(`⏳ Đang xử lý file ${format.toUpperCase()}...`);

    try {
      if (format === 'webm') {
        this.triggerBlobDownload(this.lastRecordedBlob, filename);
        this.showToast(`🎉 Đã tải file .WEBM thành công!`);
        return;
      }

      // Convert Blob to AudioBuffer
      const arrayBuffer = await this.lastRecordedBlob.arrayBuffer();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      if (format === 'wav') {
        const wavBlob = this.audioBufferToWav(audioBuffer);
        this.triggerBlobDownload(wavBlob, filename);
        this.showToast(`🎉 Đã tải file .WAV chất lượng cao thành công!`);
      } else if (format === 'mp3') {
        const mp3Blob = this.audioBufferToMp3(audioBuffer);
        this.triggerBlobDownload(mp3Blob, filename);
        this.showToast(`🎉 Đã tải file .MP3 thành công!`);
      }
    } catch (err) {
      console.error('Audio conversion error:', err);
      // Fallback: Tải webm nếu chuyển đổi lỗi
      this.triggerBlobDownload(this.lastRecordedBlob, `speaking_audio_${Date.now()}.webm`);
      this.showToast(`⚠️ Đã tải file bản gốc .WEBM!`);
    }
  }

  triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let result;
    if (numChannels === 2) {
      result = this.interleaveChannels(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }

    const dataLength = result.length * (bitDepth / 8);
    const bufferLength = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    this.writeWavString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    this.writeWavString(view, 8, 'WAVE');
    this.writeWavString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    this.writeWavString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < result.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, result[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return new Blob([view], { type: 'audio/wav' });
  }

  writeWavString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  interleaveChannels(inputL, inputR) {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  }

  audioBufferToMp3(buffer) {
    if (typeof lamejs === 'undefined') {
      return this.audioBufferToWav(buffer);
    }
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    const mp3Data = [];

    const samplesLeft = this.floatTo16BitPCM(buffer.getChannelData(0));
    let samplesRight = null;
    if (channels === 2) {
      samplesRight = this.floatTo16BitPCM(buffer.getChannelData(1));
    }

    const sampleBlockSize = 1152;
    for (let i = 0; i < samplesLeft.length; i += sampleBlockSize) {
      const leftChunk = samplesLeft.subarray(i, i + sampleBlockSize);
      let mp3buf;
      if (channels === 2 && samplesRight) {
        const rightChunk = samplesRight.subarray(i, i + sampleBlockSize);
        mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      } else {
        mp3buf = mp3encoder.encodeBuffer(leftChunk);
      }
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }
    const endBuf = mp3encoder.flush();
    if (endBuf.length > 0) {
      mp3Data.push(endBuf);
    }
    return new Blob(mp3Data, { type: 'audio/mp3' });
  }

  floatTo16BitPCM(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }

  // =================================================================
  // Âm thanh gõ nhẹ nhàng (Correct & Error Soft Audio Synth)
  // =================================================================
  playKeySound(isError = false) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;
      if (isError) {
        // Âm sai êm dịu, không chói tai: Soft low sine tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.07);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      } else {
        // Âm đúng nhẹ nhàng: Gentle mechanical tactile tick
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750 + Math.random() * 100, now);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.028);
        osc.start(now);
        osc.stop(now + 0.028);
      }
    } catch (e) {
      // AudioContext fallback
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.applySoundState();
    localStorage.setItem('eng_write_sound', this.soundEnabled.toString());
  }

  applySoundState() {
    if (this.soundEnabled) {
      this.dom.soundIcon.textContent = '🔊';
      if (this.dom.soundText) this.dom.soundText.textContent = 'Âm gõ: Bật';
      this.dom.btnToggleSound.classList.remove('is-muted');
      this.dom.btnToggleSound.title = 'Đang bật âm thanh nhẹ nhàng (Bấm để tắt)';
    } else {
      this.dom.soundIcon.textContent = '🔇';
      if (this.dom.soundText) this.dom.soundText.textContent = 'Âm gõ: Tắt';
      this.dom.btnToggleSound.classList.add('is-muted');
      this.dom.btnToggleSound.title = 'Đang tắt âm thanh (Bấm để bật)';
      this.stopSpeech();
    }
  }

  // =================================================================
  // Data & Filter Management (Chỉ dùng bài viết người dùng nạp)
  // =================================================================
  loadFilterTexts() {
    this.filteredTexts = [...this.savedCustomTexts];
  }

  loadPassage(index) {
    this.stopSpeech();
    this.resetState();

    if (this.filteredTexts.length === 0) {
      this.currentPassage = null;
      if (this.dom.passageLevel) this.dom.passageLevel.textContent = 'Trống';
      if (this.dom.passageTitle) this.dom.passageTitle.textContent = 'Chưa có bài viết nào';
      if (this.dom.btnDeleteCurrentCustom) {
        this.dom.btnDeleteCurrentCustom.style.display = 'none';
      }
      if (this.dom.selectSavedTexts) {
        this.dom.selectSavedTexts.value = '';
      }
      this.dom.typingDisplay.innerHTML = `
        <div class="empty-saved-box" style="padding: 2.5rem 1rem;">
          <div class="icon">📥</div>
          <p><strong>Bạn chưa nạp bài viết nào để luyện tập.</strong></p>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.4rem;">Hãy bấm nút <strong>"📥 Nạp bài viết mới"</strong> ở góc trên bên phải để dán đoạn văn tiếng Anh của bạn vào nhé!</p>
        </div>
      `;
      this.dom.customCaret.style.display = 'none';
      return;
    }

    if (index >= this.filteredTexts.length) index = 0;
    if (index < 0) index = this.filteredTexts.length - 1;
    this.currentIndex = index;
    this.currentPassage = this.filteredTexts[this.currentIndex];

    // Update Header Meta
    if (this.dom.passageLevel) {
      this.dom.passageLevel.textContent = this.currentPassage.level || 'Bài của tôi';
    }
    if (this.dom.passageTitle) {
      this.dom.passageTitle.textContent = this.currentPassage.title || 'Đoạn văn';
    }

    // Show delete button
    if (this.dom.btnDeleteCurrentCustom) {
      this.dom.btnDeleteCurrentCustom.style.display = 'inline-flex';
    }

    // Update Dropdown Selection
    if (this.dom.selectSavedTexts && this.currentPassage) {
      this.dom.selectSavedTexts.value = this.currentPassage.id;
    }

    // Render Characters to Display
    this.dom.customCaret.style.display = 'block';
    this.renderTextDisplay(this.currentPassage.text);
    this.updateProgressBar();
    this.updateSpeakingStage();
    this.focusInput();
  }

  // =================================================================
  // Bật / Tắt chữ gợi ý (Hint / Ghost text toggle)
  // =================================================================
  toggleHint() {
    this.hintEnabled = !this.hintEnabled;
    this.applyHintState();
    localStorage.setItem('eng_write_hint', this.hintEnabled.toString());
  }

  applyHintState() {
    if (this.hintEnabled) {
      this.dom.typingDisplay.classList.remove('hint-hidden');
      if (this.dom.btnToggleHint) {
        this.dom.btnToggleHint.textContent = '👁️ Gợi ý: Bật';
        this.dom.btnToggleHint.classList.remove('active');
        this.dom.btnToggleHint.title = 'Đang bật chữ gợi ý (Nhấn để tắt)';
      }
    } else {
      this.dom.typingDisplay.classList.add('hint-hidden');
      if (this.dom.btnToggleHint) {
        this.dom.btnToggleHint.textContent = '🙈 Gợi ý: Tắt';
        this.dom.btnToggleHint.classList.add('active');
        this.dom.btnToggleHint.title = 'Đang tắt chữ gợi ý (Nhấn để bật)';
      }
    }
  }

  // Normalize quotes and spaces for seamless typing
  cleanCharForTyping(char) {
    if (char === '’' || char === '‘' || char === '`') return "'";
    if (char === '“' || char === '”') return '"';
    if (char === '—' || char === '–') return '-';
    return char;
  }

  renderTextDisplay(text) {
    this.dom.typingDisplay.innerHTML = '';
    this.charElements = [];

    // Split text into span elements, preserving newlines & paragraphs
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.dataset.index = i;

      if (char === '\n') {
        span.className = 'char-item char-newline';
        span.textContent = '↵\n';
      } else {
        span.className = 'char-item';
        span.textContent = char;
      }

      // Click on any character/word to hear pronunciation
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(span.dataset.index, 10);
        const clickedWord = this.getWordAtCharIndex(idx);
        if (clickedWord) {
          this.speakWord(clickedWord);
        }
        this.focusInput();
      });

      this.dom.typingDisplay.appendChild(span);
      this.charElements.push(span);
    }

    this.currentIndexInText = 0;
    this.applyHintState();
    this.updateCaretPosition();
  }

  updateProgressBar() {
    if (!this.charElements.length) {
      this.dom.progressBarFill.style.width = '0%';
      return;
    }
    const percent = Math.min(100, Math.round((this.currentIndexInText / this.charElements.length) * 100));
    this.dom.progressBarFill.style.width = `${percent}%`;
  }

  // =================================================================
  // Typing Engine & Validation (Chuyên sâu Luyện Viết)
  // =================================================================
  handleKeyDown(e) {
    if (e.ctrlKey || e.altKey || e.metaKey || e.key.startsWith('F')) {
      return;
    }

    // Shortcut: Tab -> Restart
    if (e.key === 'Tab') {
      e.preventDefault();
      if (this.currentPassage) this.loadPassage(this.currentIndex);
      return;
    }

    if (!this.currentPassage || this.isFinished) return;

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      this.handleBackspace();
      return;
    }

    // Handle Enter key for newlines
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleCharacterInput('\n');
      return;
    }

    // Single character typing
    if (e.key.length === 1) {
      e.preventDefault();
      this.handleCharacterInput(e.key);
    }
  }

  // =================================================================
  // Vietnamese Telex / IME Detection & Notification
  // =================================================================
  isVietnameseChar(char) {
    const VIETNAMESE_ACCENTS_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
    return VIETNAMESE_ACCENTS_REGEX.test(char);
  }

  showImeAlert() {
    if (this.dom.imeAlertBanner) {
      this.dom.imeAlertBanner.style.display = 'flex';
      if (this.imeAlertTimeout) clearTimeout(this.imeAlertTimeout);
      this.imeAlertTimeout = setTimeout(() => {
        this.hideImeAlert();
      }, 8000);
    }
  }

  hideImeAlert() {
    if (this.dom.imeAlertBanner) {
      this.dom.imeAlertBanner.style.display = 'none';
    }
  }

  handleCharacterInput(inputChar) {
    if (this.currentIndexInText >= this.charElements.length) return;

    // Detect Vietnamese Telex / IME characters
    if (this.isVietnameseChar(inputChar)) {
      this.showImeAlert();
    }

    // Start timer on first keystroke
    if (!this.isStarted) {
      this.startTimer();
    }

    const rawTargetChar = this.currentPassage.text[this.currentIndexInText];
    const span = this.charElements[this.currentIndexInText];
    
    // Normalize characters so quotes and special punctuation match effortlessly
    const isCorrect = (inputChar === rawTargetChar) || 
                      (this.cleanCharForTyping(inputChar) === this.cleanCharForTyping(rawTargetChar));

    this.totalTypedCount++;

    if (isCorrect) {
      span.classList.remove('char-error');
      span.classList.add('char-correct');
      this.typedHistory[this.currentIndexInText] = { char: inputChar, isCorrect: true };
      this.playKeySound(false);
    } else {
      span.classList.remove('char-correct');
      span.classList.add('char-error');
      this.typedHistory[this.currentIndexInText] = { char: inputChar, isCorrect: false };
      this.errorCount++;
      this.playKeySound(true);

      // Track the incorrect word for review
      this.trackMistakeWord(this.currentIndexInText);
    }

    this.currentIndexInText++;
    this.updateCaretPosition();
    this.updateProgressBar();
    this.updateLiveStats();

    // Auto Pronounce Word When Completed (on Space, Enter, or End of Passage)
    if (inputChar === ' ' || inputChar === '\n' || this.currentIndexInText >= this.charElements.length) {
      const completedWord = this.getCompletedWordBeforeIndex(this.currentIndexInText);
      if (completedWord) {
        this.speakWord(completedWord);
      }
    } else {
      // Also if user starts a new word, pronounce the word they are typing into
      const isStartOfWord = (this.currentIndexInText === 1) || 
        (this.currentIndexInText >= 2 && /\s/.test(this.currentPassage.text[this.currentIndexInText - 2]));
      if (isStartOfWord) {
        const currentWord = this.getWordAtCharIndex(this.currentIndexInText - 1);
        if (currentWord) {
          this.speakWord(currentWord);
        }
      }
    }

    // Check completion
    if (this.currentIndexInText >= this.charElements.length) {
      this.completeSession();
    }
  }

  handleBackspace() {
    if (this.currentIndexInText === 0) return;

    this.currentIndexInText--;
    const span = this.charElements[this.currentIndexInText];
    span.classList.remove('char-correct', 'char-error');
    delete this.typedHistory[this.currentIndexInText];

    this.updateCaretPosition();
    this.updateProgressBar();
    this.updateLiveStats();
    this.playKeySound(false);
  }

  trackMistakeWord(charIndex) {
    const words = this.currentPassage.text.split(/(\s+)/);
    let runningLen = 0;
    for (const w of words) {
      if (charIndex >= runningLen && charIndex < runningLen + w.length) {
        const cleanWord = w.replace(/[^\w\s]/gi, '').trim();
        if (cleanWord) this.mistakeWords.add(cleanWord);
        break;
      }
      runningLen += w.length;
    }
  }

  updateCaretPosition() {
    if (this.currentIndexInText >= this.charElements.length) {
      const lastSpan = this.charElements[this.charElements.length - 1];
      if (lastSpan) {
        const rect = lastSpan.getBoundingClientRect();
        const containerRect = this.dom.typingContainer.getBoundingClientRect();
        this.dom.customCaret.style.left = `${rect.right - containerRect.left}px`;
        this.dom.customCaret.style.top = `${rect.top - containerRect.top + 4}px`;
      }
      return;
    }

    const currentSpan = this.charElements[this.currentIndexInText];
    if (currentSpan) {
      const rect = currentSpan.getBoundingClientRect();
      const containerRect = this.dom.typingContainer.getBoundingClientRect();
      this.dom.customCaret.style.left = `${rect.left - containerRect.left}px`;
      this.dom.customCaret.style.top = `${rect.top - containerRect.top + 4}px`;
    }
  }

  // =================================================================
  // Stats & Calculations
  // =================================================================
  startTimer() {
    this.isStarted = true;
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      this.updateTimerDisplay();
      this.updateLiveStats();
    }, 1000);
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
    this.dom.statTime.textContent = `${mins}:${secs}`;
  }

  calculateStats() {
    const minutes = Math.max(0.01, this.elapsedSeconds / 60);
    const correctCount = this.charElements.filter(s => s.classList.contains('char-correct')).length;
    const wpm = Math.round((correctCount / 5) / minutes);
    
    let accuracy = 100;
    if (this.totalTypedCount > 0) {
      accuracy = Math.max(0, Math.round(((this.totalTypedCount - this.errorCount) / this.totalTypedCount) * 100));
    }

    return { wpm, accuracy, correctCount, errorCount: this.errorCount, timeSecs: this.elapsedSeconds };
  }

  updateLiveStats() {
    const stats = this.calculateStats();
    this.dom.statWpm.textContent = stats.wpm;
    this.dom.statAcc.textContent = `${stats.accuracy}%`;
    this.dom.statErrors.textContent = stats.errorCount;
  }

  resetState() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.isStarted = false;
    this.isFinished = false;
    this.elapsedSeconds = 0;
    this.totalTypedCount = 0;
    this.errorCount = 0;
    this.typedHistory = [];
    this.mistakeWords.clear();

    this.dom.statWpm.textContent = '0';
    this.dom.statAcc.textContent = '100%';
    this.dom.statErrors.textContent = '0';
    this.dom.statTime.textContent = '00:00';
    if (this.dom.progressBarFill) this.dom.progressBarFill.style.width = '0%';
  }

  // =================================================================
  // Session Completion & Results Modal
  // =================================================================
  completeSession() {
    this.isFinished = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const stats = this.calculateStats();

    // Populate Modal
    this.dom.resWpm.textContent = stats.wpm;
    this.dom.resAcc.textContent = `${stats.accuracy}%`;
    this.dom.resErrors.textContent = stats.errorCount;
    this.dom.resTime.textContent = this.dom.statTime.textContent;

    if (stats.accuracy >= 95 && stats.wpm >= 35) {
      this.dom.resBadge.textContent = '🌟';
      this.dom.resTitle.textContent = 'Xuất sắc tuyệt đối!';
      this.dom.resSubtitle.textContent = 'Tốc độ gõ ấn tượng và độ chính xác gần như hoàn hảo.';
    } else if (stats.accuracy >= 85) {
      this.dom.resBadge.textContent = '👏';
      this.dom.resTitle.textContent = 'Rất tốt!';
      this.dom.resSubtitle.textContent = 'Bạn đang tiến bộ rất nhanh. Hãy tiếp tục duy trì!';
    } else {
      this.dom.resBadge.textContent = '💪';
      this.dom.resTitle.textContent = 'Hoàn thành bài tập!';
      this.dom.resSubtitle.textContent = 'Hãy chú ý các từ đã gõ sai và luyện tập thêm nhé.';
    }

    // Mistake list
    if (this.mistakeWords.size > 0) {
      this.dom.resMistakesBox.style.display = 'block';
      this.dom.resMistakesList.innerHTML = Array.from(this.mistakeWords)
        .map(w => `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; margin: 2px;">${w}</span>`)
        .join(' ');
    } else {
      this.dom.resMistakesBox.style.display = 'none';
    }

    // Save to History
    this.saveHistory({
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: this.currentPassage.title,
      mode: 'Luyện viết chuẩn',
      wpm: stats.wpm,
      accuracy: `${stats.accuracy}%`,
      errors: stats.errorCount
    });

    this.dom.resultModal.classList.add('active');
  }

  // =================================================================
  // LocalStorage & History
  // =================================================================
  saveHistory(item) {
    const history = JSON.parse(localStorage.getItem('eng_write_history') || '[]');
    history.unshift(item);
    if (history.length > 20) history.pop();
    localStorage.setItem('eng_write_history', JSON.stringify(history));
    this.renderHistory();
  }

  renderHistory() {
    const history = JSON.parse(localStorage.getItem('eng_write_history') || '[]');
    if (history.length === 0) {
      this.dom.historyTbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-history">Chưa có lượt luyện tập nào. Hãy bắt đầu gõ bài đầu tiên!</td>
        </tr>`;
      return;
    }

    this.dom.historyTbody.innerHTML = history.map(item => `
      <tr>
        <td>${item.date}</td>
        <td><strong>${item.title}</strong></td>
        <td><span class="badge badge-level" style="font-size: 0.7rem;">${item.mode}</span></td>
        <td><strong>${item.wpm}</strong> WPM</td>
        <td style="color: var(--success-color); font-weight: 700;">${item.accuracy}</td>
        <td style="color: ${item.errors > 0 ? 'var(--danger-color)' : 'var(--text-muted)'};">${item.errors}</td>
      </tr>
    `).join('');
  }

  updateDailyStreak() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('eng_write_last_date');
    let streak = parseInt(localStorage.getItem('eng_write_streak') || '1', 10);

    if (lastDate && lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastDate === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }
    }
    localStorage.setItem('eng_write_last_date', today);
    localStorage.setItem('eng_write_streak', streak.toString());
    if (this.dom.streakCount) this.dom.streakCount.textContent = streak;
  }

  loadSavedPreferences() {
    // Default theme = light
    const theme = localStorage.getItem('eng_write_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    this.currentThemeIndex = Math.max(0, this.themeList.indexOf(theme));
    this.dom.themeName.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);

    const sound = localStorage.getItem('eng_write_sound');
    if (sound !== null) {
      this.soundEnabled = sound === 'true';
    }
    this.applySoundState();

    const hint = localStorage.getItem('eng_write_hint');
    if (hint !== null) {
      this.hintEnabled = hint === 'true';
    }
    this.applyHintState();

    const voiceGender = localStorage.getItem('eng_write_voice_gender') || 'female';
    this.selectedVoiceGender = voiceGender;
    if (this.dom.voiceGenderSelect) {
      this.dom.voiceGenderSelect.value = voiceGender;
    }
  }

  // =================================================================
  // Event Bindings
  // =================================================================
  focusInput() {
    this.dom.stageCard.classList.add('is-focused');
    this.dom.focusOverlay.classList.add('hidden');
    this.dom.hiddenInput.focus();
  }

  blurInput() {
    this.dom.stageCard.classList.remove('is-focused');
    this.dom.focusOverlay.classList.remove('hidden');
  }

  openCustomModal() {
    const isSpeak = this.currentMode === 'speaking';
    const titleEl = document.getElementById('custom-modal-title');
    const subEl = document.getElementById('custom-modal-subtitle');
    const inputLabel = document.querySelector('label[for="custom-text-input"]');

    if (titleEl) titleEl.textContent = isSpeak ? '📥 Nạp dữ liệu luyện nói tiếng Anh' : '📥 Nạp dữ liệu luyện viết tiếng Anh';
    if (subEl) subEl.textContent = isSpeak ? 'Dán bài văn, hội thoại cần luyện nói (giữ nguyên định dạng xuống dòng & tự động lưu):' : 'Dán bài viết cần luyện gõ (giữ nguyên định dạng xuống dòng & tự động lưu):';
    if (inputLabel) inputLabel.textContent = isSpeak ? 'Nội dung bài luyện nói tiếng Anh:' : 'Nội dung bài luyện viết tiếng Anh:';

    if (this.dom.customTitleInput) this.dom.customTitleInput.value = '';
    if (this.dom.customTextInput) this.dom.customTextInput.value = '';

    // Reset format choice to inline default
    const radInline = document.getElementById('rad-format-inline');
    const lblInline = document.getElementById('lbl-format-inline');
    const lblPreserve = document.getElementById('lbl-format-preserve');
    if (radInline) radInline.checked = true;
    if (lblInline) lblInline.classList.add('active');
    if (lblPreserve) lblPreserve.classList.remove('active');

    if (this.dom.customTextModal) {
      this.dom.customTextModal.classList.add('active');
    }
    setTimeout(() => {
      if (this.dom.customTitleInput) this.dom.customTitleInput.focus();
    }, 100);
  }

  bindEvents() {
    // Focus bindings
    this.dom.typingContainer.addEventListener('click', () => this.focusInput());
    this.dom.focusOverlay.addEventListener('click', () => this.focusInput());

    // Close IME Telex Alert
    if (this.dom.btnCloseImeAlert) {
      this.dom.btnCloseImeAlert.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideImeAlert();
      });
    }

    // Detect IME Composition & Mobile Soft Keyboard input
    this.dom.hiddenInput.addEventListener('compositionend', (e) => {
      if (e.data && this.isVietnameseChar(e.data)) {
        this.showImeAlert();
      }
      if (e.data && !this.handledKeyInKeydown) {
        for (const char of e.data) {
          this.handleCharacterInput(char);
        }
      }
      this.dom.hiddenInput.value = '';
    });

    this.dom.hiddenInput.addEventListener('input', (e) => {
      if (e.data && this.isVietnameseChar(e.data)) {
        this.showImeAlert();
      }

      // Mobile Soft Keyboard character handling
      if (e.inputType === 'deleteContentBackward') {
        if (!this.handledKeyInKeydown) this.handleBackspace();
      } else if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
        if (!this.handledKeyInKeydown) this.handleCharacterInput('\n');
      } else if (e.data && e.data.length === 1) {
        if (!this.handledKeyInKeydown) this.handleCharacterInput(e.data);
      }
      this.dom.hiddenInput.value = '';
    });

    // Keystroke listeners
    window.addEventListener('keydown', (e) => {
      // If modal or input is open, don't capture typing
      if (this.dom.resultModal.classList.contains('active') || 
          this.dom.customTextModal.classList.contains('active') ||
          this.dom.manageTextsModal.classList.contains('active')) {
        return;
      }
      this.handledKeyInKeydown = true;
      setTimeout(() => { this.handledKeyInKeydown = false; }, 20);
      this.handleKeyDown(e);
    });

    window.addEventListener('resize', () => {
      this.updateCaretPosition();
    });

    // Mode Switch Tabs (Luyện Viết / Luyện Nói)
    if (this.dom.tabBtnWriting) {
      this.dom.tabBtnWriting.addEventListener('click', () => this.switchMode('writing'));
    }
    if (this.dom.tabBtnSpeaking) {
      this.dom.tabBtnSpeaking.addEventListener('click', () => this.switchMode('speaking'));
    }

    // Speaking Workspace Actions
    if (this.dom.btnSpeakListenSample) {
      this.dom.btnSpeakListenSample.addEventListener('click', () => this.speakSpeakingSample());
    }

    if (this.dom.btnRecordMic) {
      this.dom.btnRecordMic.addEventListener('click', () => this.toggleRecording());
    }

    // Toggle Hint Ghost Text
    if (this.dom.btnToggleHint) {
      this.dom.btnToggleHint.addEventListener('click', () => {
        this.toggleHint();
      });
    }

    // Voice Gender Selector (Nam / Nữ)
    if (this.dom.voiceGenderSelect) {
      this.dom.voiceGenderSelect.addEventListener('change', (e) => {
        this.selectedVoiceGender = e.target.value;
        localStorage.setItem('eng_write_voice_gender', this.selectedVoiceGender);
        if (this.isSpeaking) {
          this.speakText(this.currentPassage.text);
        }
      });
    }

    // Speak Full Passage Button (Phát âm hoặc Dừng)
    if (this.dom.btnSpeakAll) {
      this.dom.btnSpeakAll.addEventListener('click', () => {
        this.toggleSpeakPassage();
      });
    }

    // Delete Current Custom Text Button
    if (this.dom.btnDeleteCurrentCustom) {
      this.dom.btnDeleteCurrentCustom.addEventListener('click', () => {
        if (this.currentPassage && this.currentPassage.id) {
          this.deleteCustomText(this.currentPassage.id);
        }
      });
    }

    // Font Size Adjust
    if (this.dom.btnFontSizeInc) {
      this.dom.btnFontSizeInc.addEventListener('click', () => {
        if (this.fontSize < 2.2) {
          this.fontSize += 0.15;
          this.dom.typingDisplay.style.fontSize = `${this.fontSize}rem`;
          this.updateCaretPosition();
        }
      });
    }

    if (this.dom.btnFontSizeDec) {
      this.dom.btnFontSizeDec.addEventListener('click', () => {
        if (this.fontSize > 1.0) {
          this.fontSize -= 0.15;
          this.dom.typingDisplay.style.fontSize = `${this.fontSize}rem`;
          this.updateCaretPosition();
        }
      });
    }

    // Random Text
    if (this.dom.btnRandomText) {
      this.dom.btnRandomText.addEventListener('click', () => {
        const rand = Math.floor(Math.random() * this.filteredTexts.length);
        this.loadPassage(rand);
      });
    }

    // Restart & Next
    if (this.dom.btnRestart) {
      this.dom.btnRestart.addEventListener('click', () => this.loadPassage(this.currentIndex));
    }
    if (this.dom.btnNext) {
      this.dom.btnNext.addEventListener('click', () => this.loadPassage(this.currentIndex + 1));
    }

    // Sound Toggle (Bật / Tắt Âm Thanh Gõ Nhẹ Nhàng)
    if (this.dom.btnToggleSound) {
      this.dom.btnToggleSound.addEventListener('click', () => {
        this.toggleSound();
      });
    }

    // Theme Switcher
    if (this.dom.btnThemeToggle) {
      this.dom.btnThemeToggle.addEventListener('click', () => {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themeList.length;
        const theme = this.themeList[this.currentThemeIndex];
        document.documentElement.setAttribute('data-theme', theme);
        this.dom.themeName.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        localStorage.setItem('eng_write_theme', theme);
      });
    }

    // Result Modal Actions
    if (this.dom.btnModalRetry) {
      this.dom.btnModalRetry.addEventListener('click', () => {
        this.dom.resultModal.classList.remove('active');
        this.loadPassage(this.currentIndex);
      });
    }

    if (this.dom.btnModalNext) {
      this.dom.btnModalNext.addEventListener('click', () => {
        this.dom.resultModal.classList.remove('active');
        this.loadPassage(this.currentIndex + 1);
      });
    }

    // Select Submitted / Saved Text from Dropdown
    if (this.dom.selectSavedTexts) {
      this.dom.selectSavedTexts.addEventListener('change', (e) => {
        this.selectTextById(e.target.value);
      });
    }

    // Open / Close Manage Texts Modal
    if (this.dom.btnOpenManageModal) {
      this.dom.btnOpenManageModal.addEventListener('click', () => {
        const isSpeak = this.currentMode === 'speaking';
        const titleEl = document.getElementById('manage-modal-title');
        const subEl = document.getElementById('manage-modal-subtitle');
        if (titleEl) titleEl.textContent = isSpeak ? '📚 Danh sách bài luyện nói đã nạp' : '📚 Danh sách bài luyện viết đã nạp';
        if (subEl) subEl.textContent = isSpeak ? 'Chọn bất kỳ bài nào bên dưới để luyện nói hoặc xóa bài không dùng:' : 'Chọn bất kỳ bài nào bên dưới để luyện viết hoặc xóa bài không dùng:';
        this.renderManageTextsList();
        this.dom.manageTextsModal.classList.add('active');
      });
    }

    if (this.dom.btnManageClose) {
      this.dom.btnManageClose.addEventListener('click', () => {
        this.dom.manageTextsModal.classList.remove('active');
      });
    }

    if (this.dom.btnModalAddNew) {
      this.dom.btnModalAddNew.addEventListener('click', () => {
        this.dom.manageTextsModal.classList.remove('active');
        this.openCustomModal();
      });
    }

    if (this.dom.btnDeleteAllCustom) {
      this.dom.btnDeleteAllCustom.addEventListener('click', async () => {
        if (this.savedCustomTexts.length === 0 && this.savedSpeakingTexts.length === 0) {
          Notify.warning('Danh sách bài học hiện đang trống.');
          return;
        }
        const ok = await Notify.confirm(
          'Bạn có chắc chắn muốn XÓA TOÀN BỘ bài đã nạp không?\nHành động này sẽ làm trống danh sách bài viết & bài nói.',
          'Xác nhận xóa tất cả bài học',
          { isDanger: true, confirmText: '🗑️ Xóa tất cả', cancelText: 'Hủy' }
        );
        if (ok) {
          this.savedCustomTexts = [];
          this.savedSpeakingTexts = [];
          this.currentPassage = null;
          this.currentSpeakingPassage = null;
          localStorage.removeItem('eng_write_custom_texts');
          localStorage.removeItem('eng_speak_custom_texts');
          this.updateCustomTextsCount();
          this.populateSavedTextsDropdown();
          this.renderManageTextsList();
          this.loadFilterTexts();
          this.loadPassage(0);
          Notify.success('🗑️ Đã xóa toàn bộ bài đã nạp thành công!');
        }
      });
    }

    // Custom Text Modal (Nạp bài viết / nói - Tự động lưu & giữ nguyên định dạng)
    if (this.dom.btnCustomText) {
      this.dom.btnCustomText.addEventListener('click', () => {
        this.openCustomModal();
      });
    }

    if (this.dom.btnCustomCancel) {
      this.dom.btnCustomCancel.addEventListener('click', () => {
        if (this.dom.customTextModal) this.dom.customTextModal.classList.remove('active');
      });
    }

    // Custom Text Format Radio Toggle
    const radInline = document.getElementById('rad-format-inline');
    const radPreserve = document.getElementById('rad-format-preserve');
    const lblInline = document.getElementById('lbl-format-inline');
    const lblPreserve = document.getElementById('lbl-format-preserve');

    if (radInline && radPreserve) {
      radInline.addEventListener('change', () => {
        if (radInline.checked) {
          if (lblInline) lblInline.classList.add('active');
          if (lblPreserve) lblPreserve.classList.remove('active');
        }
      });
      radPreserve.addEventListener('change', () => {
        if (radPreserve.checked) {
          if (lblPreserve) lblPreserve.classList.add('active');
          if (lblInline) lblInline.classList.remove('active');
        }
      });
    }

    if (this.dom.btnCustomApply) {
      this.dom.btnCustomApply.addEventListener('click', () => {
        const rawText = this.dom.customTextInput ? this.dom.customTextInput.value : '';
        if (!rawText || !rawText.trim()) {
          Notify.warning('Vui lòng nhập hoặc dán nội dung bài tiếng Anh.');
          if (this.dom.customTextInput) this.dom.customTextInput.focus();
          return;
        }

        const radPreserveEl = document.getElementById('rad-format-preserve');
        const isPreserve = radPreserveEl && radPreserveEl.checked;
        let cleanText = '';

        if (isPreserve) {
          // Giữ nguyên cấu trúc xuống dòng như bản mẫu
          cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
        } else {
          // Viết ngang liền mạch (Mặc định): Nối tất cả các dòng lại bằng phím cách
          cleanText = rawText
            .replace(/\r\n/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }

        let title = this.dom.customTitleInput ? this.dom.customTitleInput.value.trim() : '';
        if (!title) {
          // Generate title from first line / first 5 words
          const firstLine = cleanText.split('\n')[0].trim();
          title = firstLine.split(/\s+/).slice(0, 5).join(' ');
          if (title.length < firstLine.length) title += '...';
        }

        const customItem = {
          id: (this.currentMode === 'speaking' ? 'speak_' : 'write_') + Date.now() + Math.random().toString(36).substr(2, 4),
          category: 'custom',
          title: title,
          topic: 'Bài của tôi',
          level: isPreserve ? 'Giữ dòng' : 'Viết ngang',
          formatMode: isPreserve ? 'preserve' : 'inline',
          text: cleanText
        };

        // 1. Đóng modal nạp bài ngay lập tức
        if (this.dom.customTextModal) {
          this.dom.customTextModal.classList.remove('active');
        }

        // 2. Tự động lưu và cập nhật giao diện
        this.saveCustomText(customItem, true);

        // 3. Xóa trắng form để lần sau mở ra sạch sẽ
        if (this.dom.customTitleInput) this.dom.customTitleInput.value = '';
        if (this.dom.customTextInput) this.dom.customTextInput.value = '';

        // 4. Hiển thị thông báo toast thành công
        Notify.success(`🎉 Đã nạp thành công bài: "${title}" (${isPreserve ? 'Giữ dòng' : 'Viết ngang'})!`);

        // 5. Tự động focus vào khung gõ phím
        this.focusInput();
      });
    }

    // Clear History
    if (this.dom.btnClearHistory) {
      this.dom.btnClearHistory.addEventListener('click', async () => {
        const ok = await Notify.confirm(
          'Bạn có chắc muốn xóa toàn bộ lịch sử luyện tập không?',
          'Xóa lịch sử',
          { isDanger: true, confirmText: '🗑️ Xóa lịch sử', cancelText: 'Hủy' }
        );
        if (ok) {
          localStorage.removeItem('eng_write_history');
          this.renderHistory();
          Notify.success('Đã xóa sạch lịch sử luyện tập!');
        }
      });
    }

    // ===============================================================
    // 2-Way Device Sync Events (Sync Code & File Backup)
    // ===============================================================
    if (this.dom.btnOpenSyncModal) {
      this.dom.btnOpenSyncModal.addEventListener('click', () => {
        this.openSyncModal();
      });
    }

    if (this.dom.btnSyncModalClose) {
      this.dom.btnSyncModalClose.addEventListener('click', () => {
        this.dom.syncModal.classList.remove('active');
      });
    }

    if (this.dom.tabBtnExportCode) {
      this.dom.tabBtnExportCode.addEventListener('click', () => {
        this.switchSyncTab('export');
      });
    }

    if (this.dom.tabBtnImportCode) {
      this.dom.tabBtnImportCode.addEventListener('click', () => {
        this.switchSyncTab('import');
      });
    }

    if (this.dom.tabBtnFile) {
      this.dom.tabBtnFile.addEventListener('click', () => {
        this.switchSyncTab('file');
      });
    }

    if (this.dom.btnCopySyncPin) {
      this.dom.btnCopySyncPin.addEventListener('click', () => {
        if (this.currentSyncPin) {
          navigator.clipboard.writeText(this.currentSyncPin).then(() => {
            this.showToast(`📋 Đã sao chép mã số: ${this.currentSyncPin}`);
          }).catch(() => {
            this.showToast(`📋 Mã số của bạn: ${this.currentSyncPin}`);
          });
        }
      });
    }

    if (this.dom.btnCopySyncCode) {
      this.dom.btnCopySyncCode.addEventListener('click', () => {
        if (this.dom.syncCodeOutput && this.dom.syncCodeOutput.value) {
          navigator.clipboard.writeText(this.dom.syncCodeOutput.value).then(() => {
            this.showToast('📋 Đã sao chép đoạn mã đồng bộ vào bộ nhớ tạm!');
          }).catch(() => {
            this.dom.syncCodeOutput.select();
            document.execCommand('copy');
            this.showToast('📋 Đã sao chép đoạn mã đồng bộ!');
          });
        }
      });
    }

    if (this.dom.btnApplySyncCode) {
      this.dom.btnApplySyncCode.addEventListener('click', () => {
        this.applySyncCode();
      });
    }

    if (this.dom.btnExportBackup) {
      this.dom.btnExportBackup.addEventListener('click', () => {
        this.exportBackupData();
      });
    }

    if (this.dom.btnTriggerImport) {
      this.dom.btnTriggerImport.addEventListener('click', () => {
        if (this.dom.backupFileInput) {
          this.dom.backupFileInput.value = '';
          this.dom.backupFileInput.click();
        }
      });
    }

    if (this.dom.backupFileInput) {
      this.dom.backupFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.importBackupData(e.target.files[0]);
        }
      });
    }

    // ===============================================================
    // Speaking & Voice Recording Events
    // ===============================================================
    if (this.dom.btnSubmodeSample) {
      this.dom.btnSubmodeSample.addEventListener('click', () => {
        this.switchSpeakingSubmode('sample');
      });
    }

    if (this.dom.btnSubmodeFree) {
      this.dom.btnSubmodeFree.addEventListener('click', () => {
        this.switchSpeakingSubmode('free');
      });
    }

    if (this.dom.btnSpeakListenSample) {
      this.dom.btnSpeakListenSample.addEventListener('click', () => {
        this.speakSpeakingSample();
      });
    }

    if (this.dom.btnRecordMic) {
      this.dom.btnRecordMic.addEventListener('click', () => {
        this.toggleRecording();
      });
    }

    // Audio Format Download Handlers (MP3, WAV, WebM)
    if (this.dom.btnDlMp3) {
      this.dom.btnDlMp3.addEventListener('click', () => {
        this.downloadAudioFormat('mp3');
      });
    }

    if (this.dom.btnDlWav) {
      this.dom.btnDlWav.addEventListener('click', () => {
        this.downloadAudioFormat('wav');
      });
    }

    if (this.dom.btnDlWebm) {
      this.dom.btnDlWebm.addEventListener('click', () => {
        this.downloadAudioFormat('webm');
      });
    }
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TypingApp();
});
