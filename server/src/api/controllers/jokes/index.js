const createError = require("http-errors");
const JokeService = require("@services/jokes");

const jokeService = new JokeService();

async function GetJokes(req, res) {
  try {
    const { plan } = req.body;
    if (plan) {
      const result = await jokeService.Get(plan);
      res.status(200).json(result);
    } else {
      res.status(400).send(createError(400));
    }
  } catch (error) {
    res.status(error).send(createError(error));
  }
}

module.exports = { GetJokes };
