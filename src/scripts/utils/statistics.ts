import { Assignment, DashboardStats } from '../types/assignment';
import { isOverdue } from '../utils/date';

/**
 * Calculates summary statistics for assignments.
 */
export function calculateStats(assignments: Assignment[]): DashboardStats {
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'completed').length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const overdue = assignments.filter(a => isOverdue(a.dueDate, a.status)).length;

  return {
    total,
    completed,
    pending,
    completionRate,
    overdue
  };
}
