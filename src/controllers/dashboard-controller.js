export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const viewData = {
        title: "Placemark Dashboard",
        user: loggedInUser,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addPlacemark: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPlacemark = {
        userid: loggedInUser._id,
        name: request.payload.name,
      };
      await db.placemarkStore.addPlacemark(newPlacemark);
      return h.redirect("/dashboard");
    },
  },

  deletePlacemark: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      await db.placemarkStore.deletePlacemark(placemark._id);
      return h.redirect("/dashboard");
    },
  },
};
