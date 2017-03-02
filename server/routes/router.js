var router = require('express').Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var shortid = require('shortid');

var processLog = require('./../modules/processLog');

module.exports = (function() {

    router.get('/', function(req, res) {
        res.render('index');
    });

    router.post('/upload', function(req, res) {
        var form = new formidable.IncomingForm();
        form.multiples = false;
        form.uploadDir = 'files/raw';

        var logdef = req.headers.logdef
            ? req.headers.logdef
            : '';

        if (!logdef) {
            res.status(400);
            res.send({msg: "No Log file defination provided"});
            return;
        }

        form.on('file', function(field, file) {
            var uniqueFileName = shortid.generate() + "-" + path.basename(file.name);
            fs.rename(file.path, path.join(form.uploadDir, uniqueFileName));
            processLog.processFile(path.join(form.uploadDir, uniqueFileName), logdef, function(err, path) {
                if (err) {
                    return res.send('error');
                }
                return res.send({downloadFilePath: path});
            });
        });

        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        form.on('end', function() {
            console.log("Response end inside end");
        });

        form.parse(req);
    });

    router.get('/download', function(req, res) {
        var downloadFilePath = req.query.downloadFilePath;
        if (!downloadFilePath) {
            res.status(404);
            return res.send({msg: "File not found."});
        }
        res.download(downloadFilePath);
    });

    return router;

})();
