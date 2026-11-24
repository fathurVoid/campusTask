import '../styles/main.css';

import { Assignment, AssignmentStatus, NavigationFilter } from './types/assignment';
import { getAssignments, saveAssignments } from './services/storage';
import { calculateStats } from './utils/statistics';
import { filterAndSortAssignments } from './utils/filters';
import { renderDashboardHeader } from './components/dashboard-header';
import { renderMobileNav, renderSidebar } from './components/dashboard';
import { renderTaskList } from './components/task-list';
import { openTaskForm, AssignmentFormValues } from './components/task-form';
import { showConfirmDialog, showToast } from './components/notifications';

const appName: string = import.meta.env.VITE_APP_NAME || 'CampusTask';
const appVersion: string = import.meta.env.VITE_APP_VERSION || '1.0.0';
const appEnvironment: string = import.meta.env.VITE_APP_ENV || 'development';

document.title = `${appName} — Manajemen Tugas Akademik`;

interface AppState {
  assignments: Assignment[];
  navigationFilter: NavigationFilter;
  searchQuery: string;
  priorityFilter: string;
  sortBy: string;
}

const state: AppState = {
  assignments: getAssignments(),
  navigationFilter: 'all',
  searchQuery: '',
  priorityFilter: 'all',
  sortBy: 'dueDate-asc'
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Root element #app tidak ditemukan.');

app.innerHTML = `
  <div id="sidebar-container" class="hidden md:flex"></div>
  <main class="relative flex-1 min-w-0 h-full overflow-y-auto bg-black">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
      <div id="header-container"></div>
      <div id="task-list-container"></div>
      <p class="text-center text-xs text-neutral-600 mt-8 pb-2">
        ${appName} &copy; ${new Date().getFullYear()} &middot; Dibangun dengan TypeScript &amp; Vite
      </p>
    </div>
  </main>
  <div id="mobile-nav-container"></div>
`;

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Elemen ${selector} tidak ditemukan.`);
  return element;
}

const sidebarContainer = requireElement<HTMLElement>('#sidebar-container');
const mobileNavContainer = requireElement<HTMLElement>('#mobile-nav-container');
const headerContainer = requireElement<HTMLElement>('#header-container');
const taskListContainer = requireElement<HTMLElement>('#task-list-container');

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `task-${crypto.randomUUID()}`;
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function persist(nextAssignments: Assignment[], message: string): void {
  state.assignments = nextAssignments;
  saveAssignments(nextAssignments);
  showToast(message, 'success');
  render();
}

function handleSave(values: AssignmentFormValues, editingId: string | null): void {
  if (editingId !== null) {
    let found = false;
    const updated: Assignment[] = state.assignments.map((assignment: Assignment): Assignment => {
      if (assignment.id === editingId) {
        found = true;
        return { ...assignment, ...values };
      }
      return assignment;
    });

    if (!found) {
      showToast('Tugas yang ingin diedit tidak ditemukan.', 'error');
      return;
    }

    persist(updated, 'Perubahan tugas berhasil disimpan.');
    return;
  }

  const newAssignment: Assignment = {
    id: generateId(),
    ...values,
    createdAt: new Date().toISOString()
  };

  persist([newAssignment, ...state.assignments], 'Tugas baru berhasil ditambahkan.');
}

function openAddForm(): void {
  openTaskForm({
    assignment: null,
    onSave: handleSave,
    onClose: (): void => undefined
  });
}

function openEditForm(assignment: Assignment): void {
  openTaskForm({
    assignment,
    onSave: handleSave,
    onClose: (): void => undefined
  });
}

function toggleStatus(id: string): void {
  const target = state.assignments.find((assignment: Assignment): boolean => assignment.id === id);
  if (!target) return;

  const nextStatus: AssignmentStatus = target.status === 'completed' ? 'pending' : 'completed';
  const updated: Assignment[] = state.assignments.map((assignment: Assignment): Assignment =>
    assignment.id === id ? { ...assignment, status: nextStatus } : assignment
  );

  persist(updated, nextStatus === 'completed' ? 'Tugas ditandai selesai.' : 'Tugas dikembalikan ke status pending.');
}

function deleteAssignment(id: string): void {
  const target = state.assignments.find((assignment: Assignment): boolean => assignment.id === id);
  if (!target) return;

  showConfirmDialog(
    'Hapus tugas ini?',
    `Tugas "${target.title}" akan dihapus permanen dari daftar Anda.`,
    (): void => persist(state.assignments.filter((assignment: Assignment): boolean => assignment.id !== id), 'Tugas berhasil dihapus.')
  );
}

function render(options: { focusSearch?: boolean } = {}): void {
  renderSidebar(sidebarContainer, {
    currentFilter: state.navigationFilter,
    onSelectFilter: (filter: NavigationFilter): void => {
      state.navigationFilter = filter;
      render();
    },
    appName,
    appVersion,
    environment: appEnvironment
  });

  renderMobileNav(mobileNavContainer, {
    currentFilter: state.navigationFilter,
    onSelectFilter: (filter: NavigationFilter): void => {
      state.navigationFilter = filter;
      render();
    },
    onOpenAddModal: openAddForm
  });

  renderDashboardHeader(headerContainer, {
    stats: calculateStats(state.assignments),
    onOpenAddModal: openAddForm
  });

  const visibleAssignments = filterAndSortAssignments(
    state.assignments,
    state.navigationFilter,
    state.searchQuery,
    state.priorityFilter,
    state.sortBy
  );

  renderTaskList(taskListContainer, {
    assignments: visibleAssignments,
    searchQuery: state.searchQuery,
    selectedPriority: state.priorityFilter,
    sortBy: state.sortBy,
    onSearchChange: (query: string): void => {
      state.searchQuery = query;
      render({ focusSearch: true });
    },
    onPriorityChange: (priority: string): void => {
      state.priorityFilter = priority;
      render();
    },
    onSortChange: (sort: string): void => {
      state.sortBy = sort;
      render();
    },
    onToggleStatus: toggleStatus,
    onEditTask: openEditForm,
    onDeleteTask: deleteAssignment
  });

  if (options.focusSearch) {
    const searchInput = taskListContainer.querySelector<HTMLInputElement>('#search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
  }
}

render();
