'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var PluginError = gutil.PluginError;
var fs = require('fs');
var path = require('path');

module.exports = function(options) {
    return through.obj(function(file, enc, cb) {

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-qunba-inline', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {
            var content = file.contents.toString('utf8');

            // ��ʱֻ֧��inline js
            content = content.replace(/<(script).*?src=(["'])([^>]*?)\?__inline\2><\/\1>/gmi, function(match, g1, g2, src, index, input) {
                if (/template/.test(src)) {
                    // ģ���ļ��Ͳ�inline�ˣ��Ѿ��ŵ�dev/js/template
                    return src;
                }
                return ['<script>',
                    fs.readFileSync('src/'+src).toString('utf8'),
                    '<\/script>'
                ].join(gutil.linefeed);
            });

            file.contents = new Buffer(content, 'utf8');
        }

        cb(null, file);
    });
}