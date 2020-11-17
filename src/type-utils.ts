
export function ensureArray<T>(v: T | T[]): T[] {
  if (Array.isArray(v)) {
    return v
  }
  return [v]
}
