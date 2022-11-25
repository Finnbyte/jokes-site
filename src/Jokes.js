class Jokes {
    jokeHistory = { history: [""], index: history.length - 1 };
    jokeCategories = ["programming", "misc", "pun", "spooky", "christmas"];
    currentJoke = {};
    showDarkJokes = false;

    /* Categories */
    setCategories(categoriesArr) {
        if (Array.isArray(categoriesArr)) this.jokeCategories = categoriesArr;
        if (!Array.isArray(categoriesArr)) console.log(new Date().toLocaleTimeString() + " Won't set a non-array to be jokeCategories.")
    }

    /* Cookies */
    saveToCookies() {
        localStorage.setItem("jokeHistory", JSON.stringify(this.jokeHistory, null, null));
        localStorage.setItem("jokeCategories", JSON.stringify(this.jokeCategories, null, null))
    }

    loadFromCookies() {
        /* History */
        if (localStorage.getItem("jokeHistory")) {
            const storagedHistory = JSON.parse(localStorage.getItem("jokeHistory"))
            this.jokeHistory = storagedHistory;
        } 

        /* Categories */
        if (localStorage.getItem("jokeCategories")) {
            const storagedCategories = JSON.parse(localStorage.getItem("jokeCategories"))
            this.setCategories(storagedCategories);

            /* Toggle checkboxes which have their values stored */
            this.jokeCategories.forEach((category) => {
                const checkbox = document.getElementById(category);
                if (checkbox !== null && !checkbox.checked) checkbox.checked = true
            }) 
        }
    }

    clearCookies() {
        localStorage.removeItem("jokeHistory");
        // localStorage.removeItem("jokeCategories");
    }

    /* Browsing history */
    latest() {
        if (this.jokeHistory.index < this.jokeHistory.history.length) return false
        return true
    }

    earlier() {
        this.jokeHistory.index -= 1;
    }

    next() {
        this.jokeHistory.index += 1
    }

    /* Modifying history */
    appendToHistory(jokeObj) {
        this.jokeHistory.history.push(jokeObj);
    }

    clearHistory() {
        this.jokeHistory.history = [""];
        this.jokeHistory.index = this.jokeHistory.history.length-1;
        this.clearCookies();
        this.updateUI();
    }

    /* Showing a joke (or helping to do that) */
    setCurrent() {
        this.currentJoke = this.jokeHistory.history[this.jokeHistory.index - 1];
        return this;
    }

    asText() {
        if (this.currentJoke.type === "single") return `${this.currentJoke.joke}`
        if (this.currentJoke.type === "twopart") return `${this.currentJoke.setup}\n\n${this.currentJoke.delivery}`
    }

    showJoke() {
        if (this.setCurrent().asText() === "") {
            document.getElementById("textBox").textContent = "";
            return;
        }

        document.getElementById("textBox").textContent = this.setCurrent().asText();
    }

    /* Clipboard */
    copyCurrentJoke() {
        try {
            navigator.clipboard.writeText(this.setCurrent().asText()); // Actually copy joke

            // Show a green checkmark for success or red X for failure
            document.getElementById("copySuccesful").textContent = "✔️";
            setTimeout(() => {
                document.getElementById("copySuccesful").textContent = "";
            }, 5000);

        } catch (err) {
            console.log(err);
            document.getElementById("copySuccesful").textContent = "";
            document.getElementById("copySuccesful").textContent = "❌️";
            setTimeout(() => {
                document.getElementById("copySuccesful").textContent = ""
            }, 5000);
        }
    }

    /* UI management */
    updateUI() {
        // Counter
        document.getElementById("indexCount").innerText = `${this.jokeHistory.index} / ${this.jokeHistory.history.length}`;
        // Type
        document.getElementById("jokeType").innerText = this.setCurrent().currentJoke.category || " ";
        // Dark jokes on/off
        document.getElementById("darkJokesState").innerText = this.showDarkJokes && "ON" || "OFF";
        // Text box
        this.showJoke();
        // Make joke fit
        adjustHeight("textBox");
    }

    /* Dark jokes management */
    toggleDarkJokes() {
        this.showDarkJokes = !this.showDarkJokes;
        this.updateUI();
    }
}