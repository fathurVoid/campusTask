export type Priority = 'low' | 'medium' | 'high';
export type AssignmentStatus = 'pending' | 'completed';
export type NavigationFilter = 'all' | 'completed' | 'pending';

export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string; // ISO string format YYYY-MM-DD
  priority: Priority;
  status: AssignmentStatus;
  createdAt: string; // ISO timestamp
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  overdue: number;
}
