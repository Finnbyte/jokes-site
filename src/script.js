/* These are automatically done when the site first loads. */
const jokes = new Jokes(); // Jokes-object does pretty much everything in this app
jokes.loadFromCookies(); // Take existing data from cookies
jokes.updateUI(); // Setup all the data that jokes-object has to different places on the site

/* Watch for checkbox changes */
document.addEventListener("change", (e) => {
    if (e.target.matches("input[type=checkbox]")) {
        if (e.target.checked) {
            jokes.setCategories([...jokes.jokeCategories, e.target.value]);
        } else if (!e.target.checked) {
            jokes.setCategories(jokes.jokeCategories.filter((category) => category !== e.target.value));
        }
        jokes.saveToCookies()
    }
} )

function getJoke(mode) {
    const url = !jokes.showDarkJokes && `https://v2.jokeapi.dev/joke/${jokes.jokeCategories.join(",")}`
        || `https://v2.jokeapi.dev/joke/${jokes.jokeCategories.join(",")},dark`
    
    // If there are no more locally saved score, retrieve a next new one from the API
    if (mode === "add") jokes.latest() ? getNewJoke(url) : jokes.next();
    // Go to earlier entry in the history stack
    else if (mode === "earlier") jokes.earlier();
    
    // No matter what mode, save current data to cookies
    jokes.saveToCookies();
    // Also update UI elements
    jokes.updateUI()

    // I want hoisting so regular function it is!
    function getNewJoke(url) {
        /* Get url depending on if dark jokes are allowed. */
        axios.get(url).then((res) => {
            console.log(`Request for a joke made to => ${url}`)
            jokes.appendToHistory(res.data);

            // Switch to new entry and update UI and save to cookies
            // UI has to be updated here instead of after getJoke()'s if-statements, since axios works with async.
            jokes.saveToCookies(); jokes.next(); jokes.updateUI();
        }).catch((err) => {
            document.getElementById("warning").innerText = err;
            setTimeout(() => {
                document.getElementById("warning").innerText = "";
            }, 7000)
        })
    }
}