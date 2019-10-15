const fs = require("fs");
const XLSX = require("xlsx");
const Regexp = require("./regexp");
const { log, warn, explain, toast } = require("./console");
const { replaceFileName } = require("./os-path");

const Model = module.exports = {
    BUS: document.createElement("modelEventBus"),
    _BUSY: new Event("busy"),
    _IDLE: new Event("idle"),
    _DEFAULT_FILE_NAME: "분리됨",
    _FILE_NAME: null,
    set fileName(v) {
        let appliedValue = v;
        if (!v || !(v.trim())) {
            appliedValue = Model._DEFAULT_FILE_NAME;
        }
        explain({
            "나눌 행 기준 값 변경 시도": v,
            "적용": appliedValue,
        });
        Model._FILE_NAME = appliedValue;
    },
    get fileName() {
        return Model._FILE_NAME ||
            Model._DEFAULT_FILE_NAME;
    },
    _SPLIT: 65535,
    set split(v) {
        let numberValue = Number(v);
        if (isNaN(numberValue)
            || numberValue < 1) {
            numberValue = (numberValue > 10000000
                ? 10000000
                : 1);
        }
        numberValue = Math.round(numberValue);
        Model._SPLIT = numberValue;
        explain({
            "나눌 행 기준 값 변경 시도": v,
            "적용": numberValue,
        });
    },
    get split() {
        const numberValue = Number(Model._SPLIT);
        if (isNaN(numberValue)
            || numberValue < 1) {
            return numberValue > 10000000
                ? 10000000
                : 1;
        }
        return Math.round(numberValue);
    },
    setBusy: () => Model.BUS.dispatchEvent(Model._BUSY),
    setIdle: () => {
        toast("작업 과정 종료");
        Model.BUS.dispatchEvent(Model._IDLE);
    },
    getFileDispenser: filePath => {
        Model.setBusy();
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
                warn({ "지원하지 않는 파일!": filePath });
        }
        Model.setIdle();
    },
    getXLSX: filePath => {
        explain({ "[Model.getXLSX]": filePath });
        try {
            explain("엑셀 파일 읽기 시도!");
            const workbook = XLSX.readFile(filePath);
            log(`엑셀 파일 읽기 성공! 엑셀 파일은 작업할 필요 없는데? 시트 ${workbook.SheetNames.length}개 있는 XLSX임!`);
        } catch (e) {
            warn({ "엑셀 파일 읽기 실패!": e });
        }
        Model.setIdle();
    },
    getSeparatedVariables: async (filePath, ext) => {
        log({ "[Model.getSeparatedVariables]": filePath });
        switch (ext) {
            case "csv":
                return await Model.getCommonFile(filePath, ",");
            case "tsv":
                return await Model.getCommonFile(filePath, "\t");
        }
        Model.setIdle();
    },
    convertToXLSX: async (filePath, delimiter, data) => {
        try {
            data = await (data.split("\n"));
            log({ "[Model.convertToXLSX]": `${data.length}행 찾음, ${Model.split}행씩 분할 시작` });
            data = await (data.map(v => v.split(delimiter)));
            const workbook = XLSX.utils.book_new();
            let i = 0;
            for (const count = Math.ceil(data.length / Model.split); i < count; i++) {
                let startIndex = i * Model.split;
                let endIndex = (i + 1) * Model.split;
                const sheet = XLSX.utils.aoa_to_sheet(data.slice(startIndex, endIndex));
                console.log({ startIndex, endIndex, sheet });
                XLSX.utils.book_append_sheet(workbook, sheet);
            }
            const fileName = replaceFileName(filePath, Model.fileName + ".xlsx");
            XLSX.writeFile(workbook, fileName);
            log({ "[Model.convertToXLSX]": `${i}개의 시트를 가진 [${Model.fileName}.xlsx] 저장` });
            Model.setIdle();
        } catch (e) {
            warn({ "[Model.convertToXLSX] 오류": e });
            Model.setIdle();
        }
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
                return Model.convertToXLSX(filePath, delimiter, data);
            });
        } catch (e) {
            warn({ "파일 읽기 실패!": e });
            Model.setIdle();
        }
    },
};