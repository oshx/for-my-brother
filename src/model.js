const fs = require("fs");
const XLSX = require("xlsx");
const Regexp = require("./regexp");
const { log, warn, explain } = require("./console");

const Model = module.exports = {
    _SPLIT: 65535,
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
            log(`엑셀 파일 읽기 성공! 엑셀 파일은 작업할 필요 없는데? 시트 ${workbook.SheetNames.length}개 있는 XLSX임!`);
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
    convertToXLSX: async (filePath, delimiter, data) => {
        try {
            data = await (data.split("\n"));
            log({ "[Model.convertToXLSX]": `${data.length}행 찾음` });
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
            const fileName = filePath.substring(0, filePath.lastIndexOf("/")) + "/sliced.xlsx";
            XLSX.writeFile(workbook, fileName);
            log({ "[Model.convertToXLSX]": `${i}개의 시트를 가진 XLSX 생성 완료` });
        } catch (e) {
            error({ "[Model.convertToXLSX] 오류": e });
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
        }
    },
};