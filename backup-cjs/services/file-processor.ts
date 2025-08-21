import fs from 'fs/promises';
import path from 'path';

export class FileProcessor {
  private uploadsDir: string;
  private outputsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.outputsDir = path.join(process.cwd(), 'outputs');
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      await fs.mkdir(this.outputsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create directories:', error);
    }
  }

  async saveFile(content: string, filename: string): Promise<string> {
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(this.outputsDir, safeFilename);
    
    await fs.writeFile(filePath, content, 'utf-8');
    return filePath;
  }

  async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }

  generateFilename(originalName: string, level: number): string {
    const baseName = path.basename(originalName, '.js');
    const levelSuffix = level === 1 ? 'standard' : level === 2 ? 'pro' : 'premium';
    return `${baseName}_${levelSuffix}.js`;
  }
}
