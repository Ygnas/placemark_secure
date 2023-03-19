# Placemark

Placemark is a project about a point of interest, or POI, is a specific point location that someone may find useful or interesting.\
Deployed website: (Can take up to a minute to launch instance)

- [glitch.me](https://sphenoid-mini-vault.glitch.me/)
- [render.com](https://placemark-hbg9.onrender.com/)

## Technologies Used

This project is built using `Node.js` and has a number of dependencies listed in its package.json file. Some notable dependencies include:

- `@hapi/hapi` for its server framework
- `handlebars` as its templating engine
- `joi` for data validation
- `jsonwebtoken` for JSON Web Token (JWT) authentication
- `mongodb` as its database or `firebase`

For a full list of dependencies, please refer to the package.json file.

## Installation

To install this project, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the root directory of the cloned repository.
3. Run `npm install` to install all dependencies.

## Configuration

Before launching this project, you will need to configure some environment variables. This can be done by creating a `.env` file in the root directory of the cloned repository and copying over the contents of `.env_example`. Then update each variable with your own values. This project uses Firebase as its database but it can be changed to MongoDB by changing `db.init("firebase")` to `db.init()` in `server.js`.

## Launching

To launch this project, follow these steps:

1. Navigate to the root directory of the cloned repository.
2. Run `npm start` to start the server.

The server should now be running and accessible at [http://localhost:3000](http://localhost:3000).

## Testing

To run tests for this project, follow these steps:

1. Navigate to the root directory of the cloned repository.
2. Run one of the following commands:
   - `npm run test` to run all tests
   - `npm run testmodels` to run only model tests
   - `npm run testapi` to run only API tests

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork this repository on GitHub.
2. Clone your forked repository to your local machine.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes back up to your forked repository on GitHub.
5. Open a pull request from your forked repository back into this original repository.

Please make sure that all changes are accompanied by appropriate tests and that all existing tests pass before opening a pull request.

## Author

This project was created by Ignas Baranauskas - [GitHub](https://github.com/Ygnas)
