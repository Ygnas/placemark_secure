import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";

export const db = {
  userStore: null,

  init(storeType) {
    switch (storeType) {
      case "firebase":
        console.log("Not implemented");
        break;
      default:
        this.userStore = userMongoStore;
        connectMongo();
    }
  },
};
