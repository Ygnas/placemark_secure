import { PlacemarkSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
      const allCategories = await db.categoryStore.getUserCategory(loggedInUser._id);
      const viewData = {
        title: "Edit Placemark",
        user: loggedInUser,
        category: category,
        placemark: placemark,
        allCategories: allCategories,
      };
      return h.view("placemark-view", viewData);
    },
  },

  update: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const user = request.auth.credentials;
        return h.view("placemark-view", { title: "Edit placemark error", user, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
      const newPlacemark = {
        name: request.payload.name,
        description: request.payload.description,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        categoryid: request.payload.categoryid,
      };
      await db.placemarkStore.updatePlacemark(placemark, newPlacemark);
      return h.redirect(`/category/${request.params.id}`);
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          placemark.img = url;
          await db.placemarkStore.updatePlacemark(placemark, placemark);
        }
        return h.redirect(`/category/${placemark.categoryid}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/category/${placemark.categoryid}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        // Get the image name from the URL
        // The image name is the last part of the path after the last slash
        // and before the last dot
        const imageName = placemark.img.split("/").pop().split(".")[0];
        await imageStore.deleteImage(imageName);
        placemark.img = "";
        await db.placemarkStore.updatePlacemark(placemark, placemark);
        return h.redirect(`/category/${placemark.categoryid}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/category/${placemark.categoryid}`);
    }
    }
  }
};
