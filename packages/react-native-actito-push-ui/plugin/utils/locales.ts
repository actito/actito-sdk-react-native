import { promises as fs } from 'fs';
import * as path from 'path';

export async function readLocales(
  projectRoot: string,
  locales: { [lang: string]: string }
): Promise<Record<string, Record<string, string>>> {
  const result: Record<string, Record<string, string>> = {};

  for (const [lang, relativePath] of Object.entries(locales)) {
    const fullPath = path.join(projectRoot, relativePath);
    const fileContent = await fs.readFile(fullPath, 'utf8');
    const parsed = JSON.parse(fileContent);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`Invalid locale JSON at: ${fullPath}`);
    }

    result[lang] = parsed as Record<string, string>;
  }

  return result;
}
