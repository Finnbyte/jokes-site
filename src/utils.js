// Handles resize of textBox
const adjustHeight = (id) => {
    const textBox = document.getElementById(id);
    textBox.style.height = "auto";
    textBox.style.height = `${textBox.scrollHeight}px`;
}

// Modern problems require modern solutions
const execute = (funcArgsObj) => {
    funcArgsObj.forEach((value) => {
        if (typeof value[0] === "function") {
            const args = value.slice(1, value.length);
            args.length >= 1 ? value[0](args[0]) : value[0]();
        }
    })
}