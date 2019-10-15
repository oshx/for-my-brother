const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");
const CURRENT = path.resolve(__dirname, "../");

const dependencies = {
    path,
    fs,
    XLSX,
    CURRENT,
    COLUMN_SAMPLE: "가나다".split(""),
    SAMPLE: 200000,
};

// TSV, CSV
(function ({ fs, CURRENT, SAMPLE, COLUMN_SAMPLE }) {
    const fileContentGenerator = (count, delimiter, sample) => {
        let prefix = sample
            .map(v => v + "열")
            .join(delimiter);
        let data = new Array(count)
            .fill(null)
            .map((n, i) => sample.map(v => v + i).join(delimiter));
        data[0] = prefix;
        return data.join("\n");
    };

    const CSV = {
        name: "sample.csv",
        data: fileContentGenerator(SAMPLE, ",", COLUMN_SAMPLE)
    };

    const TSV = {
        name: "sample.tsv",
        data: fileContentGenerator(SAMPLE, "\t", COLUMN_SAMPLE)
    };

    const generateFile = (option) => {
        fs.writeFile(`${CURRENT}/${option.name}`,
            option.data,
            "utf8",
            (error) => {
                if (error) {
                    console.error("[fs.writeFile]", error);
                }
                console.info("[fs.writeFile]", option.name, "FINISHED");
            });
    };

    generateFile(CSV);
    generateFile(TSV);
})(dependencies);

(function ({ XLSX, CURRENT }) {
    const 샘플 = "가나다라마바사\n아자차카타파하\n1234567".split("\n").map(v => v.split(""));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(샘플);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, `${CURRENT}/sample.xlsx`);
})(dependencies);
