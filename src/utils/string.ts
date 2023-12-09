export function getFullName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter((value) => (value ?? null) !== null).join(' ');
}
