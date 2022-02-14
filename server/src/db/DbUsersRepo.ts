import { User, UsersRepository } from "../entities/types";
import { Database } from "./database";

export function createUsersRepo(db: Database): UsersRepository {
  return {
    async create(user: User) {
      await db.none(
        'INSERT INTO Users ("id", "position_x", "position_y") VALUES ($1, $2, $3)',
        [user.id, user.position.x, user.position.y]
      );
      return user;
    },

    async upsert(user: User) {
      await db.none(
        `INSERT INTO Users ("id", "position_x", "position_y")
        VALUES ($1, $2, $3) 
        ON CONFLICT ("id") 
        DO 
           UPDATE SET position_x = $2, position_y = $3`,
        [user.id, user.position.x, user.position.y]
      );
      return user;
    },

    async disconnect(address: string) {
      await db.none(
        `UPDATE USERS
        SET "connected" = false
        WHERE id = $1`,
        [address]
      );
      return address;
    },

    async update(user: User) {
      await db.none(
        `UPDATE USERS
        SET "position_x" = $1, "position_y" = $2
        WHERE id = $3`,
        [user.position.x, user.position.y, user.id]
      );
      return user;
    },

    async exists(user: User) {
      return (
        await db.one(
          'SELECT EXISTS (SELECT 1 FROM USERS WHERE "id" = $1)',
          [user.id]
        )
      ).exists as boolean;
    },
  };
}
