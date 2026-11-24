import { Assignment, AssignmentStatus, Priority } from '../types/assignment';
import { escapeHtml } from '../utils/html';
import { showToast } from './notifications';
import { isValidDate } from '../utils/date';

export type AssignmentFormValues = Omit<Assignment, 'id' | 'createdAt'>;

interface TaskFormProps {
  assignment: Assignment | null;
  onSave: (values: AssignmentFormValues, editingId: string | null) => void;
  onClose: () => void;
}

const PRIORITIES: Array<{ value: Priority; label: string }> = [
  { value: 'low', label: 'Rendah (Low)' },
  { value: 'medium', label: 'Sedang (Medium)' },
  { value: 'high', label: 'Tinggi (High)' }
];

const STATUSES: Array<{ value: AssignmentStatus; label: string }> = [
  { value: 'pending', label: 'Belum Selesai (Pending)' },
  { value: 'completed', label: 'Sudah Selesai (Completed)' }
];

export function openTaskForm(props: TaskFormProps): void {
  const existing = document.getElementById('task-form-modal');
  if (existing) existing.remove();

  const isEditing = props.assignment !== null;
  const defaultDueDate = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const data = props.assignment;

  const modal = document.createElement('div');
  modal.id = 'task-form-modal';
  modal.className = 'fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-sm animate-fade-in';

  modal.innerHTML = `
    <div class="w-full max-w-2xl my-auto glass-card rounded-2xl shadow-2xl border border-white/10 animate-scale-in">
      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-4 p-6 border-b border-white/5">
        <div>
          <h3 class="text-xl font-bold text-white">${isEditing ? 'Edit Tugas' : 'Tambah Tugas Baru'}</h3>
          <p class="text-sm text-neutral-400 mt-1">
            ${isEditing ? 'Perbarui detail tugas akademik Anda di bawah ini.' : 'Isi detail tugas akademik untuk mulai melacak progresnya.'}
          </p>
        </div>
        <button
          type="button"
          id="close-form"
          class="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
          aria-label="Tutup form"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Form Body -->
      <form id="task-form" novalidate class="p-6 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Title -->
          <div class="md:col-span-2">
            <label for="field-title" class="block text-sm font-medium text-neutral-300 mb-2">
              Judul Tugas <span class="text-white">*</span>
            </label>
            <input
              id="field-title"
              type="text"
              value="${escapeHtml(data?.title ?? '')}"
              placeholder="Contoh: Laporan Praktikum Algoritma"
              maxlength="150"
              class="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition"
            />
            <p data-error-for="title" class="text-xs text-white font-semibold mt-1.5 hidden"></p>
          </div>

          <!-- Course -->
          <div>
            <label for="field-course" class="block text-sm font-medium text-neutral-300 mb-2">
              Mata Kuliah <span class="text-white">*</span>
            </label>
            <input
              id="field-course"
              type="text"
              value="${escapeHtml(data?.course ?? '')}"
              placeholder="Contoh: Struktur Data"
              maxlength="100"
              class="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition"
            />
            <p data-error-for="course" class="text-xs text-white font-semibold mt-1.5 hidden"></p>
          </div>

          <!-- Due Date -->
          <div>
            <label for="field-dueDate" class="block text-sm font-medium text-neutral-300 mb-2">
              Tanggal Tenggat <span class="text-white">*</span>
            </label>
            <input
              id="field-dueDate"
              type="date"
              value="${data?.dueDate ?? defaultDueDate}"
              class="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition [color-scheme:dark]"
            />
            <p data-error-for="dueDate" class="text-xs text-white font-semibold mt-1.5 hidden"></p>
          </div>

          <!-- Priority -->
          <div>
            <label for="field-priority" class="block text-sm font-medium text-neutral-300 mb-2">Prioritas</label>
            <select
              id="field-priority"
              class="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition cursor-pointer [color-scheme:dark]"
            >
              ${PRIORITIES.map(p => `
                <option value="${p.value}" class="bg-neutral-900" ${data?.priority === p.value ? 'selected' : ''}>${p.label}</option>
              `).join('')}
            </select>
          </div>

          <!-- Status -->
          <div>
            <label for="field-status" class="block text-sm font-medium text-neutral-300 mb-2">Status</label>
            <select
              id="field-status"
              class="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 transition cursor-pointer [color-scheme:dark]"
            >
              ${STATUSES.map(s => `
                <option value="${s.value}" class="bg-neutral-900" ${data?.status === s.value ? 'selected' : ''}>${s.label}</option>
              `).join('')}
            </select>
          </div>

          <!-- Description -->
          <div class="md:col-span-2">
            <label for="field-description" class="block text-sm font-medium text-neutral-300 mb-2">
              Deskripsi <span class="text-neutral-500 font-normal">(opsional)</span>
            </label>
            <textarea
              id="field-description"
              rows="3"
              maxlength="500"
              placeholder="Tambahkan catatan, link, atau langkah pengerjaan tugas..."
              class="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition resize-none"
            >${escapeHtml(data?.description ?? '')}</textarea>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button
            type="button"
            id="cancel-form"
            class="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            ${isEditing ? 'Simpan Perubahan' : 'Simpan Tugas'}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add('modal-open');

  const closeForm = (): void => {
    document.removeEventListener('keydown', handleEscape);
    modal.remove();
    document.body.classList.remove('modal-open');
    props.onClose();
  };

  const handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') closeForm();
  };

  document.addEventListener('keydown', handleEscape);
  modal.querySelector('#close-form')?.addEventListener('click', closeForm);
  modal.querySelector('#cancel-form')?.addEventListener('click', closeForm);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeForm();
  });

  const setError = (field: string, message: string): void => {
    const errorEl = modal.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.toggle('hidden', message.length === 0);
  };

  const form = modal.querySelector<HTMLFormElement>('#task-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = modal.querySelector<HTMLInputElement>('#field-title')?.value.trim() ?? '';
    const course = modal.querySelector<HTMLInputElement>('#field-course')?.value.trim() ?? '';
    const dueDate = modal.querySelector<HTMLInputElement>('#field-dueDate')?.value.trim() ?? '';
    const description = modal.querySelector<HTMLTextAreaElement>('#field-description')?.value.trim() ?? '';
    const priority = modal.querySelector<HTMLSelectElement>('#field-priority')?.value as Priority;
    const status = modal.querySelector<HTMLSelectElement>('#field-status')?.value as AssignmentStatus;

    let isValid = true;
    setError('title', '');
    setError('course', '');
    setError('dueDate', '');

    if (title.length === 0) {
      setError('title', 'Judul tugas wajib diisi.');
      isValid = false;
    }
    if (course.length === 0) {
      setError('course', 'Nama mata kuliah wajib diisi.');
      isValid = false;
    }
    if (dueDate.length === 0) {
      setError('dueDate', 'Tanggal tenggat wajib diisi.');
      isValid = false;
    }else if (!isValidDate(dueDate)) {
      setError('dueDate', 'Tanggal tidak valid. Periksa kembali tanggal, bulan, dan tahun.');
      isValid = false;
    }

    if (!isValid) {
      showToast('Validasi gagal. Mohon lengkapi field yang ditandai.', 'error');
      return;
    }

    props.onSave({ title, course, description, dueDate, priority, status }, data?.id ?? null);
    document.removeEventListener('keydown', handleEscape);
    modal.remove();
    document.body.classList.remove('modal-open');
  });

  // Autofocus the first field for faster keyboard entry.
  requestAnimationFrame(() => modal.querySelector<HTMLInputElement>('#field-title')?.focus());
}
