export function generateRandomIdWithPrefix(prefix = '') {
  return prefix + Math.ceil(Math.random() * 1e8);
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
