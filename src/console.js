let count = 0;

const ROOT = document.querySelector("#html-console");
const createLogElement = (message, type) => {
    const div = document.createElement("div");
    div.classList.add(type);
    div.innerText = `[${++count}] ${message}`;
    return div;
};

const append = element => ROOT.appendChild(element);

const log = (value, type) => append(
    createLogElement(
        JSON.stringify(value),
        type
    )
);

const Console = module.exports = {
    log: value => log(value, "info"),
    warn: value => log(value, "warn"),
    explain: value => log(value, "plain"),
};
