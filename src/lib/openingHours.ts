/** Horaires Opale — fuseau Europe/Paris. */

export type DaySchedule = {
  lunch: { start: number; end: number } | null;
  dinner: { start: number; end: number } | null;
};

/** Minutes depuis minuit. */
function hm(h: number, m: number): number {
  return h * 60 + m;
}

/**
 * 0 = dimanche … 6 = samedi (comme Date.getDay).
 * Lun–Jeu : 11:30–14:00 / 17:30–22:00
 * Ven–Sam : 11:30–14:00 / 17:30–22:30
 * Dimanche : 11:45–14:00 / 17:30–22:00
 */
export const WEEKLY_HOURS: Record<number, DaySchedule> = {
  0: {
    lunch: { start: hm(11, 45), end: hm(14, 0) },
    dinner: { start: hm(17, 30), end: hm(22, 0) },
  },
  1: {
    lunch: { start: hm(11, 30), end: hm(14, 0) },
    dinner: { start: hm(17, 30), end: hm(22, 0) },
  },
  2: {
    lunch: { start: hm(11, 30), end: hm(14, 0) },
    dinner: { start: hm(17, 30), end: hm(22, 0) },
  },
  3: {
    lunch: { start: hm(11, 30), end: hm(14, 0) },
    dinner: { start: hm(17, 30), end: hm(22, 0) },
  },
  4: {
    lunch: { start: hm(11, 30), end: hm(14, 0) },
    dinner: { start: hm(17, 30), end: hm(22, 0) },
  },
  5: {
    lunch: { start: hm(11, 30), end: hm(14, 0) },
    dinner: { start: hm(17, 30), end: hm(22, 30) },
  },
  6: {
    lunch: { start: hm(11, 30), end: hm(14, 0) },
    dinner: { start: hm(17, 30), end: hm(22, 30) },
  },
};

export type OpenStatus = {
  isOpen: boolean;
  /** Heure de fin du créneau en cours, ou prochaine ouverture. */
  untilLabel: string;
  /** true = jusqu’à la fermeture ; false = ouvre à … */
  untilIsClosing: boolean;
};

function parisParts(now: Date): { day: number; minutes: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const day = weekdayMap[parts.weekday!] ?? 0;
  const hour = Number(parts.hour === "24" ? "0" : parts.hour);
  const minute = Number(parts.minute);
  return { day, minutes: hm(hour, minute) };
}

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function slotsForDay(day: number): { start: number; end: number }[] {
  const schedule = WEEKLY_HOURS[day];
  const slots: { start: number; end: number }[] = [];
  if (schedule.lunch) slots.push(schedule.lunch);
  if (schedule.dinner) slots.push(schedule.dinner);
  return slots;
}

/** Prochaine ouverture dans les 7 jours (minutes du jour + label). */
function nextOpening(
  day: number,
  minutes: number,
): { label: string } | null {
  for (let offset = 0; offset < 7; offset++) {
    const d = (day + offset) % 7;
    for (const slot of slotsForDay(d)) {
      if (offset === 0 && slot.start <= minutes) continue;
      return { label: formatMinutes(slot.start) };
    }
  }
  return null;
}

export function getOpenStatus(now = new Date()): OpenStatus {
  const { day, minutes } = parisParts(now);
  const slots = slotsForDay(day);

  for (const slot of slots) {
    if (minutes >= slot.start && minutes < slot.end) {
      return {
        isOpen: true,
        untilLabel: formatMinutes(slot.end),
        untilIsClosing: true,
      };
    }
  }

  const next = nextOpening(day, minutes);
  return {
    isOpen: false,
    untilLabel: next?.label ?? "—",
    untilIsClosing: false,
  };
}
