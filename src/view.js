const DRAG_FILE = document.querySelector("#drag-file");

const handleToNull = () => false;

const View = module.exports = {
    bindEvent: ({
        getFile,
    }) => {
        const handleDrop = e => {
            e.preventDefault();
            for (const f of e.dataTransfer.files) {
                const { path } = f;
                console.log('파일 들어 옴: ', path);
                getFile(path);
            }
            return false;
        };
        DRAG_FILE.ondragover = handleToNull;
        DRAG_FILE.ondragleave = handleToNull;
        DRAG_FILE.ondragend = handleToNull;
        DRAG_FILE.ondrop = handleDrop;
    },
};
