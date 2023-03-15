export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret",
      admin: true
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret",
      admin: false
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret",
      admin: false
    }
  },
  category: {
    _model: "Category",
    fishing: {
      title: "Fishing",
      userid: "->users.homer"
    },
    hiking: {
      title: "Hiking",
      userid: "->users.marge"
    },
    camping: {
      title: "Camping",
      userid: "->users.bart"
    },
    snowboarding: {
      title: "Snowboarding",
      userid: "->users.homer"
    },
  },
  placemark: {
    _model : "Placemark",
    placemark_1 : {
      name: "Best lake",
      description: "Best lake in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.fishing"
    },
    placemark_2 : {
      name: "Best river",
      description: "Best river in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.fishing"
    },
    placemark_3 : {
      name: "Best sea",
      description: "Best sea in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.fishing"
    },
    placemark_4 : {
      name: "Best ocean",
      description: "Best ocean in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.fishing"
    },
    placemark_5 : {
      name: "Best mountain",
      description: "Best mountain in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.hiking"
    },
    placemark_6 : {
      name: "Best hill",
      description: "Best hill in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.hiking"
    },
    placemark_7 : {
      name: "Best forest",
      description: "Best forest in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.camping"
    },
    placemark_8 : {
      name: "Best valley",
      description: "Best valley in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.camping"
    },
    placemark_9 : {
      name: "Best ski resort",
      description: "Best ski resort in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.snowboarding"
    },
    placemark_10 : {
      name: "Best snow park",
      description: "Best snow park in the world",
      latitude: 10,
      longitude: 10,
      categoryid: "->category.snowboarding"
    },
  },
};
