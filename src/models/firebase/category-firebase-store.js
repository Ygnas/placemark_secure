import { ref, set, update, remove, get, push } from "firebase/database";
import { database } from "./initialize-firebase.js";
import { placemarkFirebaseStore } from "./placemark-firebase-store.js";

const db = database;

export const categoryFirebaseStore = {
  async getAllCategorys() {
    const snapshot = await get(ref(db, "categories"));
    if (snapshot.exists()) {
      return { ...snapshot.val(), size: snapshot.size };
    } 
      return null;
  },

  async getCategoryById(id) {
    if (id) {
      const categorySnapshot = await get(ref(db, `categories/${id}`));
      if (categorySnapshot.exists()) {
        const category = categorySnapshot.val();
        if (category) {
          category.placemarks = await placemarkFirebaseStore.getPlacemarkByCategoryId(category._id);
        }
        return category;
      }
    }
    return null;
  },

  async addCategory(category) {
    const newCategoryRef = push(ref(db, "categories"));
    category._id = newCategoryRef.key;
    await set(newCategoryRef, category);
    return this.getCategoryById(newCategoryRef.key);
  },

  async getUserCategory(id) {
    const categoriesSnapshot = await get(ref(db, "categories"));
    if (categoriesSnapshot.exists()) {
      const categoriesObj = categoriesSnapshot.val();
      return Object.values(categoriesObj).filter(category => category.userid === id);
    } 
      return null;
  },

  async deleteCategoryById(id) {
    try {
      await remove(ref(db, `categories/${id}`));
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCategories() {
     await remove(ref(db, "categories"));
   }
};