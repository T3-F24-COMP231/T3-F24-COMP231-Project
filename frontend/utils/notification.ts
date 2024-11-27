const ROUTE_MAP: Record<
  string,
  string | ((metadata?: Record<string, any>) => string)
> = {
  income: "/(screens)/incomes/",
  expense: "/(screens)/expenses/",
  debt: "/(screens)/debts",
  investment: "/(screens)/investments",
};

export const resolveRoute = (
  type: string,
  metadata?: Record<string, any>
): string => {
  const route = ROUTE_MAP[type];
  return typeof route === "function" ? route(metadata || {}) : route || "/";
};
