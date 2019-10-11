"use strict";
(function ([View, Model]) {
    const {
        node,
        chrome,
        electron,
    } = process.versions;

    console.log({ node, chrome, electron });

    View.bindEvent({
        getFile: Model.getFileDispensor,
    });

})([
    require("./view"),
    require("./model"),
]);