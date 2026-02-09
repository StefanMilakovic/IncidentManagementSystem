import {UserRole} from './enums/user-role.enum';

export interface UserDto {
  id: number | null;
  email: string;
  name: string | null;
  role: UserRole;
}
