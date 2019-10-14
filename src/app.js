"use strict";
(function ([View, Model, Console]) {
    const { explain } = Console;
    const {
        node,
        chrome,
        electron,
    } = process.versions;

    explain({
        "동작 환경": {
            node,
            chrome,
            electron,
        },
    });

    View.bindEvent({
        getFile: Model.getFileDispenser,
    });

})([
    require("./view"),
    require("./model"),
    require("./console"),
]);