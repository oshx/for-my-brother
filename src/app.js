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

    View.registModel(Model)
        .bindEvent();

})([
    require("./view"),
    require("./model"),
    require("./console"),
]);