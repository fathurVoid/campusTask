import { DashboardStats } from '../types/assignment';

interface HeaderProps {
  stats: DashboardStats;
  onOpenAddModal: () => void;
}

export function renderDashboardHeader(container: HTMLElement, props: HeaderProps): void {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('id-ID', options);

  container.innerHTML = `
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-neutral-200 text-xs font-medium mb-3">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Dashboard Akademik Mahasiswa
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Halo, Mahasiswa!</h2>
          <p class="text-sm text-neutral-400 mt-1">Berikut ringkasan progres dan daftar tugas mata kuliah Anda hari ini (${currentDate}).</p>
        </div>
        <button
          id="btn-add-task"
          type="button"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-medium text-sm transition-all duration-200 cursor-pointer shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Tasks -->
        <div class="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-white/25 transition">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl group-hover:bg-white/[0.06] transition"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-neutral-400">Total Tugas</span>
            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white tracking-tight">${props.stats.total}</span>
            <span class="text-xs text-neutral-400">tugas akademik</span>
          </div>
        </div>

        <!-- Completed Tasks -->
        <div class="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-white/25 transition">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl group-hover:bg-white/[0.06] transition"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-neutral-400">Sudah Selesai</span>
            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white tracking-tight">${props.stats.completed}</span>
            <span class="text-xs text-neutral-300 font-medium">selesai dikerjakan</span>
          </div>
        </div>

        <!-- Pending Tasks -->
        <div class="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-white/25 transition">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl group-hover:bg-white/[0.06] transition"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-neutral-400">Belum Selesai</span>
            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white tracking-tight">${props.stats.pending}</span>
            ${props.stats.overdue > 0 ? `<span class="text-xs text-white font-semibold underline decoration-white/50 underline-offset-2">(${props.stats.overdue} terlambat)</span>` : '<span class="text-xs text-neutral-400">aktif</span>'}
          </div>
        </div>

        <!-- Completion Percentage -->
        <div class="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-white/25 transition">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/[0.03] rounded-full blur-2xl group-hover:bg-white/[0.06] transition"></div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-neutral-400">Progres Kelulusan</span>
            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white tracking-tight">${props.stats.completionRate}%</span>
            <div class="w-20 bg-white/15 h-2 rounded-full overflow-hidden self-center">
              <div class="bg-white h-full rounded-full transition-all duration-500" style="width: ${props.stats.completionRate}%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-add-task')?.addEventListener('click', props.onOpenAddModal);
}
