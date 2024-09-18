export function appendSlash(str: string): string {
  if (str.endsWith('/')) return str;
  return `${str}/`;
}

export function prependSlash(str: string): string {
  if (str.startsWith('/')) return str;
  return `/${str}`;
}
