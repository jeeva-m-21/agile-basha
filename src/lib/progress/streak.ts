export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  restDayUsed: boolean;
  restDayWeekStart: string; // YYYY-MM-DD
}

export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateToUtc(str: string): number {
  const [y, m, d] = str.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function getStartOfWeek(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  return formatDate(d);
}

export function calculateUpdatedStreak(
  current: StreakState,
  today: Date = new Date()
): { state: StreakState; updated: boolean; message: string } {
  const todayStr = formatDate(today);
  const currentWeekStart = getStartOfWeek(today);

  // Reset weekly rest day if it's a new week
  let restDayUsed = current.restDayUsed;
  if (current.restDayWeekStart !== currentWeekStart) {
    restDayUsed = false;
  }

  // If already active today
  if (current.lastActiveDate === todayStr) {
    return {
      state: current,
      updated: false,
      message: "Already active today",
    };
  }

  const todayUtc = parseDateToUtc(todayStr);
  const lastUtc = parseDateToUtc(current.lastActiveDate);
  const daysDiff = Math.round((todayUtc - lastUtc) / (1000 * 3600 * 24));

  if (daysDiff === 1) {
    // Consecutive day
    const newStreak = current.currentStreak + 1;
    return {
      state: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, current.longestStreak),
        lastActiveDate: todayStr,
        restDayUsed,
        restDayWeekStart: currentWeekStart,
      },
      updated: true,
      message: "Streak extended!",
    };
  }

  if (daysDiff === 2 && !restDayUsed) {
    // Forgiving rest day rule: missed 1 day, protect streak!
    const newStreak = current.currentStreak + 1;
    return {
      state: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, current.longestStreak),
        lastActiveDate: todayStr,
        restDayUsed: true,
        restDayWeekStart: currentWeekStart,
      },
      updated: true,
      message: "Weekly rest day applied! Your streak is preserved.",
    };
  }

  // Missed more than allowed -> restart streak warmly
  return {
    state: {
      currentStreak: 1,
      longestStreak: Math.max(1, current.longestStreak),
      lastActiveDate: todayStr,
      restDayUsed: false,
      restDayWeekStart: currentWeekStart,
    },
    updated: true,
    message: "Welcome back! Starting fresh with day 1.",
  };
}
