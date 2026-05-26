function createFallbackUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : 8 + Math.floor(random / 4);

    return value.toString(16);
  });
}

export function createTaskId(): string {
  const cryptoApi = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };

  return cryptoApi.crypto?.randomUUID?.() ?? createFallbackUuid();
}
