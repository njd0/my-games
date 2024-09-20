export const cloneDeep = <T>(obj: T): T => {
  if (obj === null || obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(v => cloneDeep(v)) as unknown as T;
  }

  // Handle objects
  const result = {} as { [key: string]: any };
  for (const key in obj) {
    result[key] = cloneDeep((obj as { [k: string]: any })[key]);
  }

  return result as T;
}