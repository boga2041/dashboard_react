// utils/format.js
export const fmtInt = (n) =>
  n == null ? "—" : n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export const fmtPct = (n) =>
  n == null ? "—" : `${n.toFixed(2).replace(".", ",")}%`;
