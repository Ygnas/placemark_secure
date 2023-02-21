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
};
