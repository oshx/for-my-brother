// "C:\\projects\\for-my-brother\\sample.tsv"
// /home/user/projects/for-my-brother/sample.tsv

const OSPath = module.exports = {
    replaceFileName: (path, value) => {
        const delimiter = (path.indexOf("\\") > -1) ? "\\" : "/";
        return path.substring(0, path.lastIndexOf(delimiter)) + delimiter + value;
    },
};
