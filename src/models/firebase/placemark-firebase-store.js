import { ref, set, update, remove, get, push } from "firebase/database";
import { database } from "./initialize-firebase.js";

const db = database;

const categoryRef = ref(db, "categories");

export const placemarkFirebaseStore = {
  async getAllPlacemarks() {
    const snapshot = await get(ref(db,"placemarks"));
    if (snapshot.exists()) {
      return { ...snapshot.val(), size: snapshot.size };
    } 
      return null;
  },

  async addPlacemark(categoryId, placemark) {
    placemark.categoryid = categoryId;
    const newPlacemarkRef = push(ref(db,"placemarks"));
    placemark._id = newPlacemarkRef.key;
    await set(newPlacemarkRef, placemark);
    return this.getPlacemarkById(newPlacemarkRef.key);
  },

  async getPlacemarkByCategoryId(id) {
    const snapshot = await get(ref(db,"placemarks"));
    const placemarks = snapshot.val();
    try {
      const filteredPlacemarks = Object.values(placemarks).filter(placemark => placemark.categoryid === id);
      return filteredPlacemarks;
    } catch (error) {
      return null;
    }
  },

  async getPlacemarkById(id) {
    const snapshot = await get(ref(db,`placemarks/${id}`));
    return snapshot.val();
  },

  async deletePlacemark(id) {
    try {
      await remove(ref(db,`placemarks/${id}`));
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPlacemarks() {
    await remove(ref(db,"placemarks"));
  },

  async updatePlacemark(placemark, updatedPlacemark) {
     await update(ref(db,`placemarks/${placemark._id}`), updatedPlacemark);
   },
};