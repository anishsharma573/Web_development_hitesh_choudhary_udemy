const displayQuote = document.getElementById("display-random-quote");
const displayQuoteButton = document.getElementById("random-quote-btn");

displayQuoteButton.addEventListener("click", async () => {
  try {
   
    const response = await fetch(`
https://api.freeapi.app/api/v1/public/quotes/quote/random`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response
    
    const quote = data.data.content; // Access the `joke` property from the response
console.log(quote);

    displayQuote.textContent = quote; // Display the joke in the element
  } catch (error) {
    console.error("Error fetching jquote:", error);
    displayQuote.textContent = "Failed to fetch a quote. Please try again later.";
  }
});
