import { compare, hash } from 'bcrypt';

export const comparePassword = async (password: string, dbPassword: string) =>
  compare(password, dbPassword);

export const hashPassword = async (password: string) => hash(password, 10);
