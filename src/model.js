const fs = require("fs");
const XLSX = require("xlsx");
const Regexp = require("./regexp");
const { log, warn, explain } = require("./console");

const Model = module.exports = {
    _SPLIT: 100000,
    set split(v) {
        Model._SPLIT = v;
    },
    get split() {
        let numberValue = Number(Model._SPLIT);
        if (isNaN(numberValue)
            || numberValue < 1) {
            return numberValue > 10000000
                ? 10000000
                : 1;
        }
        return Math.round(numberValue);
    },
    getFileDispenser: filePath => {
        explain({
            "파일 전달": filePath,
            "분류 작업": "[Model.getFileDispenser]",
        });
        switch (true) {
            case !!filePath.match(Regexp.EXT_XLSX):
                return Model.getXLSX(filePath);
            case !!filePath.match(Regexp.EXT_TSV):
                return Model.getSeparatedVariables(filePath, "tsv");
            case !!filePath.match(Regexp.EXT_CSV):
                return Model.getSeparatedVariables(filePath, "csv");
            default:
                return warn({ "지원하지 않는 파일!": filePath });
        }
    },
    getXLSX: filePath => {
        explain({ "[Model.getXLSX]": filePath });
        try {
            explain("엑셀 파일 읽기 시도!");
            const workbook = XLSX.readFile(filePath);
            log(`엑셀 파일 읽기 성공! 엑셀 파일은 작업할 필요 없잖아? 읽은 내용만 보여줌! 시트 ${workbook.SheetNames.length}개 찾음.`);
            log(workbook);
            console.log({ workbook });
        } catch (e) {
            warn({ "엑셀 파일 읽기 실패!": e });
        }
    },
    getSeparatedVariables: async (filePath, ext) => {
        log({ "[Model.getSeparatedVariables]": filePath });
        switch (ext) {
            case "csv":
                return await Model.getCommonFile(filePath, ",");
            case "tsv":
                return await Model.getCommonFile(filePath, "\t");
        }
    },
    parseLineData: async (data, delimiter) => {
        data = await (data.split("\n"));
        log({ "[Model.parseLineData]": `${data.length}행 찾음` });
        data = await (data.map(v => v.split(delimiter)));
        console.log({ data });
    },
    splitWorkbook: async (data) => {
        log({ "[Model.splitWorkbook]": data.length });
        console.log(data);
    },
    getCommonFile: async (filePath, delimiter) => {
        explain({ "[Model.getCommonFile]": filePath });
        try {
            explain("일반 파일 읽기 시도! [UTF-8]로 읽기!");
            return await fs.readFile(filePath, "utf8", async (error, data) => {
                if (error) {
                    return warn({ "일반 파일 읽는 도중에 오류 발생!": error });
                }
                log({ "파일 읽기 성공!": filePath });
                return Model.parseLineData(data, delimiter);
            });
        } catch (e) {
            warn({ "파일 읽기 실패!": e });
        }
    },
};