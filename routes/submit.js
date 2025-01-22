function showScore() {
    const form = document.getElementById("quiz-form");
    const formData = new FormData(form);
    let score = 0;
  
    const totalQuestions = document.querySelectorAll(".ques").length;
  
    // Calculate score based on correct answers
    for (let [key, value] of formData.entries()) {
      if (value === "true") {
        score++;
      }
    }
  
    // Add score to a hidden input field before submission
    const hiddenScoreInput = document.createElement("input");
    hiddenScoreInput.type = "hidden";
    hiddenScoreInput.name = "score";  // Make sure this matches the field name in your backend
    hiddenScoreInput.value = score;
    form.appendChild(hiddenScoreInput);
  
    // Display the score (optional)
    document.getElementById("quiz-score").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("score-result").innerText = `Your Score: ${score}/${totalQuestions}`;
  
    // Submit the form with the score
    setTimeout(function() {
      form.submit(); // Submit the form
    }, 2000);  // Optional delay
  }
  