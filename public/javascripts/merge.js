module.exports = function (target,source) {
    for (var i in source) {
        if (source.hasOwnProperty(i)) {
            target[i] = source[i];
        }
    }
    return target;
};
module.exports.deepMerge = function deepMerge(target,source) {
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                if (!target[i]) {
                    target[i] = source[i];
                } else {
                    deepMerge(target[i],source[i]);
                }
            }
        }
        return target;
    };
