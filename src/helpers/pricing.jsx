export function converterNumberAtPricePeru(number) {
  const formatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
  });
  return formatter.format(number);
}
