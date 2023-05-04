import bcrypt from "bcrypt";
import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec, UserSpecUpdate } from "../models/joi-schemas.js";

const saltRounds = 10;

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
      user.password = await bcrypt.hash(user.password, saltRounds);
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
      const passwordsMatch = await bcrypt.compare(password, user ? user.password : "");
      if (!user || !passwordsMatch) {
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

  // The accountSettings function handles requests to the account settings page
  // It checks if the user is an admin, and if so, sends all users, categories and placemarks to the view
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

  // The editSettings function handles requests to the edit account settings page
  // Before sending fields to edit, it removes empty fields
  editSettings: {
    validate: {
      payload: UserSpecUpdate,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const user = request.auth.credentials;
        return h.view("account-view", { title: "Edit Account Settings error", user, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = await db.userStore.getUserByEmail(request.auth.credentials.email);
      const updatedUser = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        password: request.payload.password,
      };
      Object.keys(updatedUser).forEach((value) => {
        if (updatedUser[value] === "") {
          delete updatedUser[value];
        }
      });
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

  // The adminDashboard function handles requests to the admin dashboard page
  // It checks if the user is an admin, and if not, redirects them to the home page
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

  signupOAuth: {
    auth: "github-oauth",
    handler: async function (request, h) {
      if (!request.auth.isAuthenticated) {
        return h.view("signup-view", { title: "Sign up error", errors: "Not logged in..." }).takeover().code(400);
      }

      const user = {
        firstName: request.auth.credentials.profile.displayName.split(" ")[0],
        lastName: request.auth.credentials.profile.displayName.split(" ")[1],
        email: `${request.auth.credentials.profile.id}@placemark`,
        password: "",
        admin: false
      }

      if (!await db.userStore.getUserByEmail(user.email)) {
        await db.userStore.addUser(user);
      }

      const userFromDB = await db.userStore.getUserByEmail(user.email);
      request.cookieAuth.set({ id: userFromDB._id });
      return h.redirect("/dashboard");
    },
  },
};
