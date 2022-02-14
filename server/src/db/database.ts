import pgPromise, { IDatabase } from "pg-promise";
import { DEFAULT_DATABASE_CONFIG } from "../config/db";
import { FriendshipsRepository, UsersRepository } from "../entities/types";
import { createFriendshipsRepo as createFriendshipsRepo } from "./DbFriendshipsRepo";
import { createUsersRepo } from "./DbUsersRepo";

interface DbExtensions {
  friendships: FriendshipsRepository;
  users: UsersRepository
}

export type Database = IDatabase<DbExtensions> & DbExtensions;

export function createDatabase(): Database {
  const pgp = pgPromise({
    extend: (db: Database) => {
      db.friendships = createFriendshipsRepo(db);
      db.users = createUsersRepo(db);
    },
  });

  return pgp(DEFAULT_DATABASE_CONFIG);
}
