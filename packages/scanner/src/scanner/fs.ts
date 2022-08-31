import fs from 'fs';

export type PathStats = fs.Stats;
export class FileSystemExeption extends Error {}

export class FS {
  public static async readDir(path: string): Promise<string[]> {
    return new Promise((resolve) => {
      fs.readdir(path, (error: Error | null, files: string[]) => {
        if (error) {
          throw new FileSystemExeption(error.message);
        }

        resolve(files);
      });
    })
  }

  public static async stat(path: string): Promise<PathStats> {
    return new Promise((resolve) => {
      fs.stat(path, (error: Error | null, stats: fs.Stats) => {
        if (error) {
          throw new FileSystemExeption(error.message);
        }

        resolve(stats);
      })
    })
  }

  public static isFileExists(file: string): boolean {
    return fs.existsSync(file);
  }
}
