import Argon from 'argon2';
import { ISession } from './interface';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await Argon.hash(password);
  return hashedPassword;
};

export const verifyPassword = async (
  inputPassword: string,
  dbPassword: string
): Promise<boolean> => {
  const isCorrect = await Argon.verify(dbPassword, inputPassword);
  return isCorrect;
};

export const isProd = () => process.env.NODE_ENV === 'production';

export const isAuthenticated = (session: ISession): boolean => {
  if (session.userId) return true;
  return false;
};
