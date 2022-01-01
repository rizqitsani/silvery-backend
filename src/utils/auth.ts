import { compare, hash } from 'bcrypt';

const comparePassword = async (password: string, dbPassword: string) =>
  compare(password, dbPassword);

const hashPassword = async (password: string) => hash(password, 10);

export { comparePassword, hashPassword };
