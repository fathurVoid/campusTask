import { Assignment, Priority } from '../types/assignment';
import { formatDate, getDaysRemainingText, isOverdue } from '../utils/date';
import { escapeHtml } from '../utils/html';

interface TaskListProps {
  assignments: Assignment[];
  searchQuery: string;
  selectedPriority: string;
  sortBy: string;
  onSearchChange: (query: string) => void;
  onPriorityChange: (priority: string) => void;
  onSortChange: (sort: string) => void;
  onToggleStatus: (id: string) => void;
  onEditTask: (assignment: Assignment) => void;
  onDeleteTask: (id: string) => void;
}

export function renderTaskList(container: HTMLElement, props: TaskListProps): void {
  container.innerHTML = `
    <div class="glass-card rounded-2xl p-6 shadow-xl border border-white/6 mb-12">
      <!-- Controls Bar: Search, Filters, Sort -->
      <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6 pb-6 border-b border-white/5">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input
            id="search-input"
            type="text"
            value="${escapeHtml(props.searchQuery)}"
            placeholder="Cari judul tugas atau nama mata kuliah..."
            class="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition"
          />
        </div>

        <!-- Filters & Sorting -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Priority Filter -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-neutral-400 font-medium hidden sm:inline">Prioritas:</span>
            <select
              id="filter-priority"
              class="px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-neutral-300 focus:outline-none focus:border-white/40 transition cursor-pointer"
            >
              <option value="all" ${props.selectedPriority === 'all' ? 'selected' : ''} class="bg-neutral-900">Semua Prioritas</option>
              <option value="high" ${props.selectedPriority === 'high' ? 'selected' : ''} class="bg-neutral-900">Tinggi (High)</option>
              <option value="medium" ${props.selectedPriority === 'medium' ? 'selected' : ''} class="bg-neutral-900">Sedang (Medium)</option>
              <option value="low" ${props.selectedPriority === 'low' ? 'selected' : ''} class="bg-neutral-900">Rendah (Low)</option>
            </select>
          </div>

          <!-- Sort By -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-neutral-400 font-medium hidden sm:inline">Urutkan:</span>
            <select
              id="sort-by"
              class="px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-neutral-300 focus:outline-none focus:border-white/40 transition cursor-pointer"
            >
              <option value="dueDate-asc" ${props.sortBy === 'dueDate-asc' ? 'selected' : ''} class="bg-neutral-900">Tenggat Terdekat</option>
              <option value="dueDate-desc" ${props.sortBy === 'dueDate-desc' ? 'selected' : ''} class="bg-neutral-900">Tenggat Terjauh</option>
              <option value="priority" ${props.sortBy === 'priority' ? 'selected' : ''} class="bg-neutral-900">Prioritas Tertinggi</option>
              <option value="title" ${props.sortBy === 'title' ? 'selected' : ''} class="bg-neutral-900">Judul (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table / Cards Content -->
      ${props.assignments.length === 0 ? `
        <div class="text-center py-16 px-4">
          <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-500">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-1">Tidak ada tugas ditemukan</h3>
          <p class="text-sm text-neutral-400 max-w-sm mx-auto">Belum ada tugas yang sesuai dengan kriteria pencarian atau filter yang Anda pilih.</p>
        </div>
      ` : `
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Judul & Mata Kuliah</th>
                <th class="py-3 px-4">Tenggat Waktu</th>
                <th class="py-3 px-4">Prioritas</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-sm">
              ${props.assignments.map(task => {
                const isCompleted = task.status === 'completed';
                const overdue = isOverdue(task.dueDate, task.status);
                const remaining = getDaysRemainingText(task.dueDate);

                const priorityBadge: Record<Priority, { label: string; class: string }> = {
                  high: { label: 'Tinggi', class: 'bg-white text-black border-white' },
                  medium: { label: 'Sedang', class: 'bg-white/15 text-white border-white/30' },
                  low: { label: 'Rendah', class: 'bg-white/5 text-neutral-300 border-white/20' }
                };

                return `
                  <tr class="group hover:bg-white/[0.02] transition">
                    <!-- Status Toggle Checkbox / Button -->
                    <td class="py-4 px-4 align-top w-12">
                      <button
                        type="button"
                        data-toggle-id="${task.id}"
                        class="w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer mt-0.5 ${
                          isCompleted
                            ? 'bg-white border-white text-black'
                            : 'border-white/30 bg-white/5 hover:border-white hover:bg-white/10'
                        }"
                        title="${isCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'}"
                      >
                        ${isCompleted ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>` : ''}
                      </button>
                    </td>

                    <!-- Title & Course -->
                    <td class="py-4 px-4 align-top">
                      <div class="font-semibold text-white group-hover:text-neutral-200 transition ${isCompleted ? 'line-through text-neutral-500' : ''}">
                        ${escapeHtml(task.title)}
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/5 text-neutral-200 border border-white/10">
                          ${escapeHtml(task.course)}
                        </span>
                      </div>
                      ${task.description ? `<p class="text-xs text-neutral-400 mt-1.5 line-clamp-2">${escapeHtml(task.description)}</p>` : ''}
                    </td>

                    <!-- Due Date -->
                    <td class="py-4 px-4 align-top whitespace-nowrap">
                      <div class="text-neutral-200 font-medium">${formatDate(task.dueDate)}</div>
                      <div class="text-xs mt-1 ${overdue ? 'text-white font-semibold underline decoration-white/50 underline-offset-2 flex items-center gap-1' : 'text-neutral-400'}">
                        ${overdue ? `<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>` : ''}
                        <span>${remaining.text}</span>
                      </div>
                    </td>

                    <!-- Priority -->
                    <td class="py-4 px-4 align-top whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityBadge[task.priority].class}">
                        ${priorityBadge[task.priority].label}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-4 px-4 align-top text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          data-edit-id="${task.id}"
                          class="p-2 rounded-xl bg-white/5 hover:bg-white/20 text-neutral-300 hover:text-white transition cursor-pointer"
                          title="Edit Tugas"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button
                          type="button"
                          data-delete-id="${task.id}"
                          class="p-2 rounded-xl bg-white/5 hover:bg-white text-neutral-300 hover:text-black transition cursor-pointer"
                          title="Hapus Tugas"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;

  // Event Listeners
  const searchInput = container.querySelector('#search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    props.onSearchChange((e.target as HTMLInputElement).value);
  });

  const prioritySelect = container.querySelector('#filter-priority') as HTMLSelectElement;
  prioritySelect?.addEventListener('change', (e) => {
    props.onPriorityChange((e.target as HTMLSelectElement).value);
  });

  const sortSelect = container.querySelector('#sort-by') as HTMLSelectElement;
  sortSelect?.addEventListener('change', (e) => {
    props.onSortChange((e.target as HTMLSelectElement).value);
  });

  // Toggle Status
  container.querySelectorAll('button[data-toggle-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle-id');
      if (id) props.onToggleStatus(id);
    });
  });

  // Edit Task
  container.querySelectorAll('button[data-edit-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-edit-id');
      const task = props.assignments.find(a => a.id === id);
      if (task) props.onEditTask(task);
    });
  });

  // Delete Task
  container.querySelectorAll('button[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-id');
      if (id) props.onDeleteTask(id);
    });
  });
}
