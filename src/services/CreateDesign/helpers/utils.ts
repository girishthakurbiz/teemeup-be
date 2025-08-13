export function replacePlaceholders(
  template: string,
  values: Record<string, any>
): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    const value = values[trimmedKey];
    return typeof value === "string" ? value : JSON.stringify(value);
  });
}