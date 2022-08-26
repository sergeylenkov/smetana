export function trim(str: string, chars: string[]): string {
  let result = str;

  chars.forEach(char => {
    if (result.startsWith(char)) {
      result = result.slice(1);
    }

    if (result.endsWith(char)) {
      result = result.slice(0, -1);
    }
  });

  return result;
}
