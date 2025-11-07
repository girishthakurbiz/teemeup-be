export function replacePlaceholders(
  template: string,
  values: Record<string, any>
): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const path = key.trim().split('.');
    let value = values;

    for (const part of path) {
      const match = part.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const [, arrKey, index] = match;
        value = value?.[arrKey]?.[parseInt(index, 10)];
      } else {
        value = value?.[part];
      }
    }

    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  });
}


export const safeJSONParse = (input: string): any => {
  try {
    return JSON.parse(input);
  } catch {
    console.error("Failed to parse JSON:", input);
    return {};
  }
};