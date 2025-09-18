export class SignupDto {
  email!: string;
  password!: string;
  company_id?: string;
  role?: 'user' | 'company_admin' | 'operator';
}
export class LoginDto {
  email!: string;
  password!: string;
}
export type Role = 'user' | 'company_admin' | 'operator';
