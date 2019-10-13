const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const CURRENT = path.resolve(__dirname, "../");

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
    data: fileContentGenerator(200000, ",", ["가", "나", "다"])
};

const TSV = {
    name: "sample.tsv",
    data: fileContentGenerator(200000, "\t", ["가", "나", "다"])
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
XLSX.writeFile()