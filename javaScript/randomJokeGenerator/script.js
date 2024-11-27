const displayRandomJoke = document.getElementById("display-random-joke");
const displayRandomJokeButton = document.getElementById("random-joke-btn");

displayRandomJokeButton.addEventListener("click", async () => {
  try {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json", // Request JSON format
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response
    const joke = data.joke; // Access the `joke` property from the response

    displayRandomJoke.textContent = joke; // Display the joke in the element
  } catch (error) {
    console.error("Error fetching joke:", error);
    displayRandomJoke.textContent = "Failed to fetch a joke. Please try again later.";
  }
});
