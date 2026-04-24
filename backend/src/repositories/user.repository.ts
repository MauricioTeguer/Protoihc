import type { PrismaClient } from "@prisma/client";

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async getOrCreateImplicitUser(email: string, name: string) {
    return this.db.user.upsert({
      where: { email },
      update: {},
      create: { email, name },
    });
  }
}
