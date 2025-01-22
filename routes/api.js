var express = require("express");
const axios = require("axios");
var router = express.Router();
const he = require("he");

// Holy Shuffler
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fetch data from OpenTDB random 10 questions
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=10&category=18&type=multiple`
    );

    const questions = response.data.results.map((question) => {
      // combines correct and incorrect choices in a single array for easy shuffle function
      const allAnswers = [
        { text: he.decode(question.correct_answer), isCorrect: true },
        ...question.incorrect_answers.map((incorrect) => ({
          text: he.decode(incorrect),
          isCorrect: false,
        })),
      ];

      return {
        ...question,
        question: he.decode(question.question),
        answers: shuffleArray(allAnswers),
      };
    });

    res.render("questions", {
      title: "Your Trial Starts Here",
      questions,
    });
  } catch (error) {
    res.status(500).send("Error retrieving data from OpenTDB");
  }
});

// Fetch data from OpenTDB with user inputs
router.post("/", async (req, res) => {
  const difficulty = req.body.difficulty;

  try {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=10&category=18&type=multiple`
    );

    const questions = response.data.results.map((question) => {
      // combines correct and incorrect choices in a single array for easy shuffle function
      const allAnswers = [
        { text: he.decode(question.correct_answer), isCorrect: true },
        ...question.incorrect_answers.map((incorrect) => ({
          text: he.decode(incorrect),
          isCorrect: false,
        })),
      ];

      return {
        ...question,
        question: he.decode(question.question),
        answers: shuffleArray(allAnswers),
      };
    });

    res.render("questions", { title: "Your Trial Starts Here", questions });
  } catch (error) {
    res.status(500).send("Error retrieving data from OpenTDB");
  }
});

module.exports = router;
