type Messages = Record<string, unknown>;

function resolve(obj: Messages, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = (current as Messages)[part];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export async function getT(locale: string) {
  const messages = (
    await import(`../../messages/${locale}.json`)
  ).default as Messages;

  return function t(key: string): string {
    return resolve(messages, key);
  };
}
