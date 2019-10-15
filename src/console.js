let count = 0;

const ROOT = document.querySelector("#html-console");
const createLogElement = (message, type) => {
    const div = document.createElement("div");
    div.classList.add(type);
    div.innerText = `[${++count}] ${message}`;
    return div;
};
const TOAST_ELEMENT = document.querySelector("#message-queue");
const toast = value => {
    TOAST_ELEMENT.innerText = value + "";
    TOAST_ELEMENT.classList.add("visible");
    return setTimeout(() => TOAST_ELEMENT.classList.remove("visible"), 1000);
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
    toast: value => toast(value),
};
