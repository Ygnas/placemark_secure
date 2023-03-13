import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec, UserSpecUpdate } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },

  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemark" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },

  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  settings: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const viewData = {
        title: "Account Settings",
        user: loggedInUser,
      };
      if (loggedInUser && loggedInUser.admin === true) {
        const users = await db.userStore.getAllUsers();
        const categories = await db.categoryStore.getAllCategorys();
        const placemarks = await db.placemarkStore.getAllPlacemarks();
        viewData.allUsers = users;
        viewData.allCategories = categories;
        viewData.allPlacemarks = placemarks;
      }
      return h.view("account-view", viewData);
    },
  },

  editSettings: {
    validate: {
      payload: UserSpecUpdate,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("account-view", { title: "Edit Account Settings error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = await db.userStore.getUserByEmail(request.auth.credentials.email);
      const updatedUser = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        password: request.payload.password,
      };
      await db.userStore.updateUser(user, updatedUser);
      return h.redirect("/account");
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      await db.userStore.deleteUserById(request.params.id)
      return h.redirect("/account");
    },
  },

  adminDashboard: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const users = await db.userStore.getAllUsers();
      const categories = await db.categoryStore.getAllCategorys();
      const placemarks = await db.placemarkStore.getAllPlacemarks();
      const viewData = {
        title: "Admin Dashboard",
        user: loggedInUser,
        allUsers: users,
        allCategories: categories,
        allPlacemarks: placemarks,
      };
      if (!loggedInUser.admin) {
        return h.redirect("/");
      }
      return h.view("admin-view", viewData);
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
