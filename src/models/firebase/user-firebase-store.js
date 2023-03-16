import { ref, set, update, remove, get, push } from "firebase/database";
import { database } from "./initialize-firebase.js";

const db = database;

export const userFirebaseStore = {
  async getAllUsers() {
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      return { ...snapshot.val(), size: snapshot.size };
    } 
      return null;
  },

  async getUserById(id) {
    if (id) {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);
      return { ...snapshot.val(), _id: snapshot.key };
    }
    return null;
  },

  async addUser(user) {
    const newUserId = push(ref(db,"users")).key;
    const newUser = { ...user, admin: false, _id: newUserId };
    await set(ref(db,`users/${newUserId}`),newUser);
    return this.getUserById(newUserId);
  },

  async getUserByEmail(email) {
    const snapshot = await get(ref(db, "users"));
    let result = null;
  
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().email === email) {
        result = { ...childSnapshot.val(), _id: childSnapshot.key };
      }
    });
  
    return result;
  },
   
   async deleteUserById(id) {
     try{
       await remove(ref(db,`users/${id}`));
     }catch(error){
       console.log("bad id");
     }
   },
   
   async deleteAll() {
     await remove(ref(db,"users"));
   },
   
   async updateUser(user, updatedUser) {
     await update(ref(db,`users/${user._id}`),updatedUser);
   },
   
   async makeUserAdmin(id){
     await update(ref(db,`users/${id}`),{admin:true});
   }
};