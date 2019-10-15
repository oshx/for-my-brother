const DRAG_FILE = document.querySelector("#drag-file");
const SPLIT_INPUT = document.querySelector("#split");
const FILE_NAME_INPUT = document.querySelector("#file-name");
const HTML_CONSOLE = document.querySelector("#html-console");

const { log } = require("./console");
const handleToNull = () => false;

const View = module.exports = {
    _MODEL: null,
    registModel: (Model) => {
        View._MODEL = Model;
        return View;
    },
    bindEvent: () => {
        const Model = View._MODEL;
        const handleDrop = e => {
            e.preventDefault();
            for (const f of e.dataTransfer.files) {
                const { path } = f;
                log({ "[View.handleDrop] 파일 인입": path });
                Model.getFileDispenser(path);
            }
            return false;
        };
        const handleSplitBlur = e => {
            if (e.currentTarget.value === "") {
                return;
            }
            Model.split = e.currentTarget.value;
            e.currentTarget.value = "";
            e.currentTarget.placeholder = Model.split;
        };
        const handleFileNameBlur = e => {
            if (e.currentTarget.value === "") {
                return;
            }
            Model.fileName = e.currentTarget.value;
            e.currentTarget.value = "";
            e.currentTarget.placeholder = Model.fileName + ".xlsx";
        };
        const handleModelBusy = e => {
            HTML_CONSOLE.classList.add("busy");
        };
        const handleModelIdle = e => {
            HTML_CONSOLE.classList.remove("busy");
        };
        Model.BUS.addEventListener("busy", handleModelBusy);
        Model.BUS.addEventListener("idle", handleModelIdle);
        DRAG_FILE.ondragover = handleToNull;
        DRAG_FILE.ondragleave = handleToNull;
        DRAG_FILE.ondragend = handleToNull;
        DRAG_FILE.ondrop = handleDrop;

        SPLIT_INPUT.placeholder = Model.split;
        SPLIT_INPUT.addEventListener("blur", handleSplitBlur, false);

        FILE_NAME_INPUT.placeholder = Model.fileName + ".xlsx";
        FILE_NAME_INPUT.addEventListener("blur", handleFileNameBlur, false);
        return View;
    },
};
