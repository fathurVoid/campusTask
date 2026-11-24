function parseDate(dateString: string): Date {
  // YYYY-MM-DD is interpreted as UTC by JavaScript; append time to keep it local.
  return new Date(dateString.length === 10 ? `${dateString}T00:00:00` : dateString);
}

export function isValidDate(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  try {
    return parseDate(dateString).toLocaleDateString('id-ID', options);
  } catch {
    return dateString;
  }
}

export function isOverdue(dueDateString: string, status: string): boolean {
  if (status === 'completed') return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = parseDate(dueDateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  } catch {
    return false;
  }
}

export function getDaysRemainingText(dueDateString: string): { text: string; isOverdue: boolean } {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = parseDate(dueDateString);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Terlambat ${Math.abs(diffDays)} hari`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Jatuh tempo hari ini', isOverdue: false };
    } else if (diffDays === 1) {
      return { text: 'Besok', isOverdue: false };
    } else {
      return { text: `${diffDays} hari lagi`, isOverdue: false };
    }
  } catch {
    return { text: dueDateString, isOverdue: false };
  }
}
