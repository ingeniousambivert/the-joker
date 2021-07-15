const logger = require("@helpers/logger");
const {
  randomOneJoke,
  randomFiveJokes,
  randomTenJokes,
} = require("@helpers/jokes");

class JokeService {
  async Get(plan) {
    return new Promise(async (resolve, reject) => {
      try {
        switch (plan) {
          case "free":
            const freeContent = randomOneJoke();
            if (freeContent) {
              resolve(freeContent);
            } else {
              reject(404);
            }
            break;
          case "basic":
            const basicContent = randomFiveJokes();
            if (basicContent) {
              resolve(basicContent);
            } else {
              reject(404);
            }
            break;
          case "pro":
            const proContent = randomTenJokes();
            if (proContent) {
              resolve(proContent);
            } else {
              reject(404);
            }
            break;

          default:
            break;
        }
      } catch (error) {
        logger.error("JokeService.Get", error);
        reject(500);
      }
    });
  }
}

module.exports = JokeService;
