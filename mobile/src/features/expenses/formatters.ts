export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function getCurrentMonthValue() {
  return new Date().toISOString().slice(0, 7);
}

export function shiftMonth(monthValue: string, offset: number) {
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return date.toISOString().slice(0, 7);
}

export function formatMonthLabel(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  return new Intl.DateTimeFormat("es-UY", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
