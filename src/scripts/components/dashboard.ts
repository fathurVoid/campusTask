import { NavigationFilter } from '../types/assignment';
import { escapeHtml } from '../utils/html';

interface SidebarProps {
  currentFilter: NavigationFilter;
  onSelectFilter: (filter: NavigationFilter) => void;
  appName: string;
  appVersion: string;
  environment: string;
}

export function renderSidebar(container: HTMLElement, props: SidebarProps): void {
  const navItems: Array<{ id: NavigationFilter; label: string; icon: string }> = [
    {
      id: 'all',
      label: 'Semua Tugas',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`
    },
    {
      id: 'pending',
      label: 'Belum Selesai',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      id: 'completed',
      label: 'Sudah Selesai',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    }
  ];

  container.innerHTML = `
    <aside class="w-64 glass-sidebar flex flex-col h-full shrink-0 select-none z-20">
      <!-- Brand Logo -->
      <div class="p-6 flex items-center gap-3 border-b border-white/5">
        <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-bold text-xl">
          CT
        </div>
        <div>
          <h1 class="font-bold text-white tracking-wide text-lg">${escapeHtml(props.appName)}</h1>
          <p class="text-xs text-neutral-400 font-medium">University Dashboard</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="p-4 flex-1 space-y-1.5 overflow-y-auto">
        <div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Menu Utama</div>
        ${navItems.map(item => {
          const isActive = props.currentFilter === item.id;
          return `
            <button
              type="button"
              data-filter="${item.id}"
              class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }"
            >
              <span class="${isActive ? 'text-black' : 'text-neutral-400 group-hover:text-white transition'}">${item.icon}</span>
              <span>${item.label}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Footer Info -->
      <div class="p-4 border-t border-white/5 m-3 rounded-xl bg-white/[0.02]">
        <div class="flex items-center justify-between text-xs text-neutral-400 mb-1">
          <span>Versi Aplikasi</span>
          <span class="font-mono text-white">v${props.appVersion}</span>
        </div>
        <div class="flex items-center justify-between mt-2">
          <p class="text-[11px] text-neutral-500">Web App Dev Assignment</p>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 bg-white/5 px-2 py-0.5 rounded-md">${props.environment}</span>
        </div>
      </div>
    </aside>
  `;

  container.querySelectorAll('button[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') as NavigationFilter;
      if (filter) {
        props.onSelectFilter(filter);
      }
    });
  });
}

interface MobileNavProps {
  currentFilter: NavigationFilter;
  onSelectFilter: (filter: NavigationFilter) => void;
  onOpenAddModal: () => void;
}

/**
 * Bottom navigation for small screens; keeps every sidebar destination reachable.
 */
export function renderMobileNav(container: HTMLElement, props: MobileNavProps): void {
  const items: Array<{ id: NavigationFilter; label: string; icon: string }> = [
    {
      id: 'all',
      label: 'Semua',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`
    },
    {
      id: 'pending',
      label: 'Proses',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      id: 'completed',
      label: 'Selesai',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    }
  ];

  container.innerHTML = `
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-30 glass-sidebar border-t border-white/10 border-r-0 px-3 pb-[env(safe-area-inset-bottom)] pt-2">
      <div class="flex items-center justify-around gap-1">
        ${items.map(item => {
          const isActive = props.currentFilter === item.id;
          return `
            <button
              type="button"
              data-mobile-filter="${item.id}"
              class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-medium transition ${
                isActive ? 'text-white bg-white/15' : 'text-neutral-400 hover:text-white'
              }"
            >
              ${item.icon}
              <span>${item.label}</span>
            </button>
          `;
        }).join('')}
        <button
          type="button"
          id="mobile-add-task"
          class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-medium text-white transition"
        >
          <span class="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </span>
          <span>Tambah</span>
        </button>
      </div>
    </nav>
  `;

  container.querySelectorAll<HTMLButtonElement>('button[data-mobile-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-mobile-filter') as NavigationFilter;
      if (filter) props.onSelectFilter(filter);
    });
  });

  container.querySelector('#mobile-add-task')?.addEventListener('click', props.onOpenAddModal);
}
