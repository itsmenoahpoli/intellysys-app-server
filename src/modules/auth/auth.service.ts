import type { User, UserRole } from "@prisma/client";
import { UsersService } from "../users/users.service";

export type AuthUser = Omit<User, "passwordHash"> & {
  userRole: UserRole;
};

export type LoginUserResponse = {
  email: string;
  name: string;
  userRole: {
    name: string;
  };
};

export class AuthService {
  constructor(private readonly users: UsersService) {}

  private toPublicUser(
    user: User & { userRole: UserRole },
  ): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userRoleId: user.userRoleId,
      userRole: user.userRole,
    };
  }

  toLoginResponse(user: AuthUser): LoginUserResponse {
    return {
      email: user.email,
      name: user.name,
      userRole: {
        name: user.userRole.name,
      },
    };
  }

  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      return null;
    }

    const valid = await Bun.password.verify(password, user.passwordHash);
    if (!valid) {
      return null;
    }

    return this.toPublicUser(user);
  }
}
