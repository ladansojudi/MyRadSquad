export type Birthday = { year: number; month: number; day: number };

/** Whole years between a birthday (month is 0-based) and `today`. */
export function ageOn(birthday: Birthday, today: Date): number {
  let age = today.getFullYear() - birthday.year;
  const beforeBirthday =
    today.getMonth() < birthday.month ||
    (today.getMonth() === birthday.month && today.getDate() < birthday.day);
  if (beforeBirthday) age -= 1;
  return age;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
