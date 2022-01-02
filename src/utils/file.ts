import { unlink } from 'fs/promises';

export const deleteFile = async (filePath: string) => {
  await unlink(filePath);
};
