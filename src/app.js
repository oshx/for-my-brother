"use strict";

const {
    node,
    chrome,
    electron,
} = process.versions;

const View = require("./view");
const Model = require("./model");

console.log({ node, chrome, electron });


View.bindEvent({
    getFile: Model.getFileDispensor,
});
