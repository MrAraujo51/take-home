import { AppComponents } from "../app/interfaces";
import { User, UserUpdate } from "../entities/types";
import { ServiceError } from "../utils/express-utils";

export function usersLogic({
  usersRepo,
}: Pick<AppComponents, "usersRepo">) {
  return {

    async bulkUpdate(userUpdate: UserUpdate) {
      
      const usersToMove = userUpdate.moved;
      const usersToDisconenect = userUpdate.disconnected;

      let usersToMovePromises = usersToMove.map(user => {
        usersRepo.upsert(user)
      });

      let usersToDisconnectPromises = usersToDisconenect.map(address => {
        usersRepo.disconnect(address);
      })

      try {
        await Promise.all(usersToMovePromises);
        await Promise.all(usersToDisconnectPromises);
        console.log('Users are already moved and disconnected');
      } catch (error) {
        console.log(Error);
      }
      
    },
  };
}
