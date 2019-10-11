const fs = require("fs");
const XLSX = require("xlsx");
const Regexp = require("./regexp");

const Model = module.exports = {
    getFileDispensor: filePath =>
        filePath
            && filePath.match(Regexp.EXT_XLSX)
            ? Model.getXLSX(filePath)
            : Model.getCommonFile(filePath),
    getXLSX: filePath => {
        try {
            console.log("엑셀 파일 읽기 시도!\n", filePath);
            const workbook = XLSX.readFile(filePath);
            console.log("엑셀 파일 읽기 성공!\n", workbook);
        } catch (e) {
            console.error("엑셀 파일 읽기 실패!\n", e);
        }
    },
    getCommonFile: (filePath) => {
        try {
            console.log("일반 파일 읽기 시도!");
            fs.readFile(filePath, "utf8", (error, data) => {
                if (error) {
                    return console.warn("읽는 도중에 오류 발생!", error);
                }
                console.log("파일 읽기 성공!\n", data);
            });
        } catch (e) {
            console.error("파일 읽기 실패!", filePath, e);
        }
    },
};