export interface FriendshipsRepository {
  create(friendship: Friendship): Promise<Friendship>;
  exists(friendship: Friendship): Promise<boolean>;
  getAll(): Promise<Friendship[]>;
}

export interface UsersRepository {
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  upsert(user: User): Promise<User>;
  exists(user: User): Promise<boolean>;
  disconnect(address: string): Promise<string>
  // delete(user: User): Promise<boolean>;;
}

export type Friendship = {
  userAddress1: string;
  userAddress2: string;
};


export type User = {
  id: string,
  position: {
    x: number,
    y: number
  }
};

export type UserUpdate = {
  moved: User[],
  disconnected: string[]
}
