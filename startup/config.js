import config from "config";

function configSettings() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error(
      "FATAL ERROR: jwtPrivateKey (env: vidly_jwtPrivateKey) is not defined"
    );
  }
}

export default configSettings;
