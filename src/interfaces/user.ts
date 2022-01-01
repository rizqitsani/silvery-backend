import { UserRole } from '@/models/user.model';

export class UserLoginDto {
  email: string;
  password: string;
}

export class UserRegisterDto {
  full_name: string;
  telephone: string;
  address: string;
  email: string;
  role: UserRole;
  password: string;
}
