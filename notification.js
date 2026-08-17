/**
 * Custom Notification & Dialog System (Toast, Alert, Confirm)
 * Vivid Colors, Sharp Typography, Glassmorphism Animations
 * Tác giả: KS.Huỳnh Tiến Hiểu
 */

(function () {
  'use strict';

  // Ensure DOM container for Toasts exists
  let toastContainer = null;
  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.getElementById('custom-notify-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'custom-notify-container';
        toastContainer.className = 'custom-notify-container';
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  // Ensure DOM container for Modal Dialogs exists
  let dialogBackdrop = null;
  let dialogCard = null;
  let dialogIcon = null;
  let dialogTitle = null;
  let dialogMessage = null;
  let dialogActions = null;

  function initDialogDom() {
    if (dialogBackdrop) return;

    dialogBackdrop = document.createElement('div');
    dialogBackdrop.className = 'custom-dialog-backdrop';
    dialogBackdrop.id = 'custom-dialog-backdrop';

    dialogBackdrop.innerHTML = `
      <div class="custom-dialog-card" id="custom-dialog-card">
        <div class="custom-dialog-header">
          <div class="custom-dialog-icon" id="custom-dialog-icon">💡</div>
          <h3 class="custom-dialog-title" id="custom-dialog-title">Thông báo</h3>
        </div>
        <div class="custom-dialog-message" id="custom-dialog-message">Nội dung thông báo</div>
        <div class="custom-dialog-actions" id="custom-dialog-actions">
          <!-- Buttons injected dynamically -->
        </div>
      </div>
    `;

    document.body.appendChild(dialogBackdrop);

    dialogCard = document.getElementById('custom-dialog-card');
    dialogIcon = document.getElementById('custom-dialog-icon');
    dialogTitle = document.getElementById('custom-dialog-title');
    dialogMessage = document.getElementById('custom-dialog-message');
    dialogActions = document.getElementById('custom-dialog-actions');
  }

  const Notify = {
    /**
     * Hiển thị Toast thông báo nhanh góc trên bên phải
     * @param {string} message - Nội dung thông báo
     * @param {'success'|'error'|'warning'|'info'} type - Loại thông báo
     * @param {number} duration - Thời gian hiển thị (ms), mặc định 3500ms
     */
    toast(message, type = 'success', duration = 3500) {
      const container = getToastContainer();
      const toast = document.createElement('div');
      toast.className = `custom-toast toast-${type}`;

      let icon = '✨';
      let title = 'Thông báo';
      if (type === 'success') {
        icon = '✅';
        title = 'Thành công';
      } else if (type === 'error') {
        icon = '❌';
        title = 'Có lỗi xảy ra';
      } else if (type === 'warning') {
        icon = '⚠️';
        title = 'Lưu ý';
      } else if (type === 'info') {
        icon = 'ℹ️';
        title = 'Thông tin';
      }

      toast.innerHTML = `
        <span class="custom-toast-icon">${icon}</span>
        <div class="custom-toast-body">
          <div class="custom-toast-title">${title}</div>
          <div class="custom-toast-message">${message}</div>
        </div>
        <button type="button" class="custom-toast-close" title="Đóng">&times;</button>
        <div class="custom-toast-progress"></div>
      `;

      container.appendChild(toast);

      // Trigger show animation
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      const closeBtn = toast.querySelector('.custom-toast-close');
      const progress = toast.querySelector('.custom-toast-progress');

      if (progress) {
        progress.style.transition = `transform ${duration}ms linear`;
        requestAnimationFrame(() => {
          progress.style.transform = 'scaleX(0)';
        });
      }

      let timer = setTimeout(dismiss, duration);

      function dismiss() {
        if (timer) clearTimeout(timer);
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }

      closeBtn.addEventListener('click', dismiss);
    },

    success(message, duration) {
      this.toast(message, 'success', duration);
    },

    error(message, duration) {
      this.toast(message, 'error', duration);
    },

    warning(message, duration) {
      this.toast(message, 'warning', duration);
    },

    info(message, duration) {
      this.toast(message, 'info', duration);
    },

    /**
     * Hộp thoại Alert đẹp mắt, trả về Promise
     * @param {string} message - Nội dung
     * @param {string} [title] - Tiêu đề hộp thoại
     * @param {'info'|'warning'|'danger'|'success'} [type] - Kiểu icon
     * @param {string} [btnText] - Chữ nút bấm
     * @returns {Promise<void>}
     */
    alert(message, title = 'Thông báo', type = 'info', btnText = 'Đã hiểu') {
      initDialogDom();

      return new Promise((resolve) => {
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;

        dialogIcon.className = `custom-dialog-icon dialog-icon-${type}`;
        if (type === 'danger') dialogIcon.textContent = '❌';
        else if (type === 'warning') dialogIcon.textContent = '⚠️';
        else if (type === 'success') dialogIcon.textContent = '✅';
        else dialogIcon.textContent = '💡';

        dialogActions.innerHTML = `
          <button type="button" class="custom-dialog-btn btn-confirm" id="btn-dialog-ok">
            ${btnText}
          </button>
        `;

        const okBtn = document.getElementById('btn-dialog-ok');
        const closeHandler = () => {
          dialogBackdrop.classList.remove('active');
          okBtn.removeEventListener('click', closeHandler);
          resolve();
        };

        okBtn.addEventListener('click', closeHandler);
        dialogBackdrop.classList.add('active');
        okBtn.focus();
      });
    },

    /**
     * Hộp thoại Confirm xác nhận 2 nút (Đồng ý / Hủy), trả về Promise<boolean>
     * @param {string} message - Nội dung câu hỏi
     * @param {string} [title] - Tiêu đề
     * @param {object} [options] - Tùy chọn { confirmText, cancelText, isDanger, type }
     * @returns {Promise<boolean>}
     */
    confirm(message, title = 'Xác nhận hành động', options = {}) {
      initDialogDom();

      const {
        confirmText = 'Đồng ý',
        cancelText = 'Hủy bỏ',
        isDanger = false,
        type = isDanger ? 'danger' : 'warning'
      } = options;

      return new Promise((resolve) => {
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;

        dialogIcon.className = `custom-dialog-icon dialog-icon-${type}`;
        dialogIcon.textContent = isDanger ? '🗑️' : '❓';

        dialogActions.innerHTML = `
          <button type="button" class="custom-dialog-btn btn-cancel" id="btn-dialog-cancel">
            ${cancelText}
          </button>
          <button type="button" class="custom-dialog-btn ${isDanger ? 'btn-danger' : 'btn-confirm'}" id="btn-dialog-confirm">
            ${confirmText}
          </button>
        `;

        const cancelBtn = document.getElementById('btn-dialog-cancel');
        const confirmBtn = document.getElementById('btn-dialog-confirm');

        const cleanUp = (result) => {
          dialogBackdrop.classList.remove('active');
          cancelBtn.removeEventListener('click', onCancel);
          confirmBtn.removeEventListener('click', onConfirm);
          resolve(result);
        };

        const onCancel = () => cleanUp(false);
        const onConfirm = () => cleanUp(true);

        cancelBtn.addEventListener('click', onCancel);
        confirmBtn.addEventListener('click', onConfirm);

        dialogBackdrop.classList.add('active');
        if (isDanger) {
          cancelBtn.focus();
        } else {
          confirmBtn.focus();
        }
      });
    }
  };

  // Expose to window
  window.Notify = Notify;

  // Override standard window.alert so all built-in calls use Notify.alert
  window.alert = function (message) {
    return Notify.alert(message, 'Thông báo', 'info');
  };

})();
