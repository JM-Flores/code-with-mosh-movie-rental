export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Use Babel to transform JavaScript and JSX
  },
  extensionsToTreatAsEsm: [".ts"], // Treat .ts and .js files as ES Modules
  testEnvironment: "node", // Use the Node.js environment for testing
};
