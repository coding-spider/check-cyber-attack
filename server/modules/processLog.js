var geoip = require('geoip-lite');
var split = require('split');
var fs = require('fs');
var path = require('path');

module.exports = (function() {

    function getCheckParams(fileDef) {
        var fileDefArr = fileDef.trim().split(",");
        fileDefArr = fileDefArr.map(function(d) {
            return d.trim();
        });
        return {
            originHeaderIdx: fileDefArr.indexOf('ORIGIN_HEADER') > -1
                ? fileDefArr.indexOf('ORIGIN_HEADER')
                : null,
            clientIpIdx: fileDefArr.indexOf('CLIENT_IP:port') > -1
                ? fileDefArr.indexOf('CLIENT_IP:port')
                : null
        }
    }

    function checkForAttack(line, checkParams) {
        line = line.replace(/MATLAB R2013a/g, "MATLAB-R2013a");
        var lineArr = line.split(" ");
        var attacked = false;
        var ip = "";
        var ipDetails = "";
        var originHeader = "";
        if (checkParams.originHeaderIdx) {
            originHeader = lineArr[checkParams.originHeaderIdx];
            if (originHeader == '"MATLAB-R2013a"' || originHeader == 'MATLAB-R2013a') {
                attacked = true;
            }
        }
        if (checkParams.clientIpIdx) {
            ip = lineArr[checkParams.clientIpIdx]
            if (ip.indexOf(":") > -1) {
                ip = ip.split(":")[0];
            }
            ipDetails = geoip.lookup(ip);
            if (ipDetails && ipDetails.country != "IN") {
                attacked = true;
            }
        }
        if (attacked) {
            line = "YES, " + line;
        } else {
            line = "NO, " + line;
        }
        line = line.replace(/MATLAB-R2013a/g, "MATLAB R2013a");
        return line;
    }

    function processFile(filePath, logDef, callback) {
        var writeFilePath = path.join('files/processed', path.basename(filePath));
        var processedLogStream = fs.createWriteStream(writeFilePath, {'flags': 'w'});

        //Params to lookup harcoded.
        var checkParams = getCheckParams(logDef);
        fs.createReadStream(filePath).pipe(split()).on('data', function(line) {
            if (line) {
                line = checkForAttack(line, checkParams);
            } else {
                line = '\n\n';
            }
            processedLogStream.write(line);
        }).on('end', function() {
            return callback(null, writeFilePath);
        });
    }

    return {processFile: processFile}
})();
