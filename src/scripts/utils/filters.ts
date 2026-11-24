import { Assignment, NavigationFilter } from '../types/assignment';

/**
 * Applies search, priority and navigation filters, then sorts the result.
 * Keeps the filtering logic independent from the DOM components.
 */
export function filterAndSortAssignments(
  assignments: Assignment[],
  navigationFilter: NavigationFilter,
  searchQuery: string,
  priorityFilter: string,
  sortBy: string
): Assignment[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered: Assignment[] = assignments.filter((assignment: Assignment): boolean => {
    if (navigationFilter === 'completed' && assignment.status !== 'completed') return false;
    if (navigationFilter === 'pending' && assignment.status !== 'pending') return false;
    if (priorityFilter !== 'all' && assignment.priority !== priorityFilter) return false;

    if (query.length > 0) {
      const haystack = `${assignment.title} ${assignment.course}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  // Return a copy so the source array order stays intact.
  const sorted: Assignment[] = [...filtered];

  sorted.sort((a: Assignment, b: Assignment): number => {
    switch (sortBy) {
      case 'dueDate-desc':
        return b.dueDate.localeCompare(a.dueDate);
      case 'priority': {
        const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3) || a.dueDate.localeCompare(b.dueDate);
      }
      case 'title':
        return a.title.localeCompare(b.title);
      case 'dueDate-asc':
      default:
        return a.dueDate.localeCompare(b.dueDate);
    }
  });

  return sorted;
}
