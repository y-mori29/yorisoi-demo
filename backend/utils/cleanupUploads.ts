import fs from 'fs';
import path from 'path';

export const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

export function cleanupUploads() {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Failed to read uploads directory:', err);
      }
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Failed to remove temporary file ${filePath}:`, unlinkErr);
        }
      });
    });
  });
}
