export function first(it: string | string[] | undefined) {
  return Array.isArray(it) ? it[0] : it;
}
