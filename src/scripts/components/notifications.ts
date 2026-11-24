import { escapeHtml } from '../utils/html';

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-neutral-900/90 border-white/20 text-white',
    error: 'bg-black/90 border-white/60 text-white',
    info: 'bg-neutral-800/90 border-white/20 text-white'
  };

  const icons = {
    success: `<svg class="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error: `<svg class="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info: `<svg class="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
  };

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md animate-fade-in text-sm font-medium ${bgColors[type]}`;
  toast.innerHTML = `
    ${icons[type]}
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function showConfirmDialog(title: string, message: string, onConfirm: () => void): void {
  const existing = document.getElementById('confirm-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'confirm-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in';
  modal.innerHTML = `
    <div class="glass-card max-w-md w-full p-6 rounded-2xl shadow-2xl border border-white/10 animate-scale-in">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-white/10 border border-white/25 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">${escapeHtml(title)}</h3>
          <p class="text-sm text-neutral-400 mt-1">${escapeHtml(message)}</p>
        </div>
      </div>
      <div class="flex items-center justify-end gap-3 mt-6">
        <button id="cancel-confirm" type="button" class="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition">Batal</button>
        <button id="ok-confirm" type="button" class="px-4 py-2 text-sm font-medium text-black bg-white hover:bg-neutral-200 rounded-xl transition">Ya, Hapus</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();

  modal.querySelector('#cancel-confirm')?.addEventListener('click', closeModal);
  modal.querySelector('#ok-confirm')?.addEventListener('click', () => {
    onConfirm();
    closeModal();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
