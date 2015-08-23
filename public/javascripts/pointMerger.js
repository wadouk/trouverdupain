//http://www.geodatasource.com/developers/javascript
var merge = require("./merge.js");
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
}

module.exports.mergeNearPoints = function (points) {
    return points.reduce(function (acc,curr) {
        var nearPoints = acc.filter(function (item) {
            return distance(curr.coordinates[0],curr.coordinates[1],item.coordinates[0],item.coordinates[1],"K") < 0.020;
        });
        if (nearPoints.length == 0) {
            acc.push(curr);
        } else {
            merge.deepMerge(nearPoints[0],curr);
        }
        return acc;
    },[]);
};
