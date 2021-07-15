const jokes = require("@root/static/jokes/index.json");

const randomN = (jokeArray, n) => {
  const limit = jokeArray.length < n ? jokeArray.length : n;
  const randomIndicesSet = new Set();

  while (randomIndicesSet.size < limit) {
    const randomIndex = Math.floor(Math.random() * jokeArray.length);
    if (!randomIndicesSet.has(randomIndex)) {
      randomIndicesSet.add(randomIndex);
    }
  }

  return Array.from(randomIndicesSet).map((randomIndex) => {
    return jokeArray[randomIndex];
  });
};

const randomOneJoke = () => {
  return [jokes[Math.floor(Math.random() * jokes.length)]];
};

const randomFiveJokes = () => randomN(jokes, 5);

const randomTenJokes = () => randomN(jokes, 10);

module.exports = { randomOneJoke, randomFiveJokes, randomTenJokes };
