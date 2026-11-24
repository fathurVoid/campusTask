import { Assignment, Priority, AssignmentStatus } from '../types/assignment';

/**
 * Generic localStorage storage utility as required by the TypeScript specification.
 * Retrieves data from localStorage with type safety and fallback support.
 */
export function getStorageData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

/**
 * Generic localStorage setter utility.
 */
export function setStorageData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}

const STORAGE_KEY = 'campustask_assignments';

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'task-1',
    title: 'Implementasi Web Service RESTful dengan Node.js & Express',
    course: 'Pemrograman Web Lanjut',
    description: 'Membuat autentikasi JWT, middleware rate limiting, dan dokumentasi API dengan Swagger untuk sistem akademik.',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Analisis Kompleksitas Algoritma Sorting (MergeSort vs QuickSort)',
    course: 'Struktur Data & Algoritma',
    description: 'Melakukan benchmarking waktu eksekusi pada dataset 1.000.000 angka acak dan membuat laporan PDF.',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Perancangan Skema ERD & Normalisasi Database Sistem KRS',
    course: 'Sistem Basis Data',
    description: 'Membuat Normal Form hingga 3NF untuk entitas Mahasiswa, Dosen, Mata Kuliah, dan Jadwal Kuliah.',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    priority: 'medium',
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Presentasi Proposal Tugas Akhir / Skripsi',
    course: 'Metodologi Penelitian',
    description: 'Menyiapkan slide deck pitch 10 slide mengenai topik penerapan AI untuk deteksi plagiarisme kode.',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    priority: 'low',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const VALID_PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const VALID_STATUSES: AssignmentStatus[] = ['pending', 'completed'];

/**
 * Type guard: validates unknown localStorage data before trusting it as Assignment[].
 */
function isAssignmentArray(value: unknown): value is Assignment[] {
  if (!Array.isArray(value)) return false;

  return value.every((item: unknown): boolean => {
    if (typeof item !== 'object' || item === null) return false;
    const candidate = item as Record<string, unknown>;

    return (
      typeof candidate.id === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.course === 'string' &&
      typeof candidate.description === 'string' &&
      typeof candidate.dueDate === 'string' &&
      typeof candidate.createdAt === 'string' &&
      VALID_PRIORITIES.includes(candidate.priority as Priority) &&
      VALID_STATUSES.includes(candidate.status as AssignmentStatus)
    );
  });
}

export function getAssignments(): Assignment[] {
  const stored = getStorageData<unknown>(STORAGE_KEY, null);

  if (isAssignmentArray(stored)) {
    return stored;
  }

  // Missing or invalid data: restore a usable first-launch state.
  if (stored !== null) {
    console.warn('Stored assignment data was invalid. Restoring sample assignments.');
  }
  saveAssignments(INITIAL_ASSIGNMENTS);
  return [...INITIAL_ASSIGNMENTS];
}

export function saveAssignments(assignments: Assignment[]): void {
  setStorageData<Assignment[]>(STORAGE_KEY, assignments);
}
