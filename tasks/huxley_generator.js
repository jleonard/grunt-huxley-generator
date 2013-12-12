/*
 * grunt-huxley-generator
 * https://github.com/john.leonard/grunt-huxley-generator
 *
 * Copyright (c) 2013 John Leonard
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('huxley_generator', 'Auto generate a huxleyfile  to rcrawl an .html directory and capture screenshots.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      queryString: '',
      rootUrl: 'http://localhost:8080',
      huxleyFile: 'Huxleyfile.json',
      screenSizes: [{name:'xl','size':[1200,900]},{name:'l','size':[1024,768]},{name:'m','size':[768,1024]},{name:'s','size':[320,240]},{name:'xs','size':[240,320]}]
    });

    f.dest = f.dest.charAt(f.dest.length - 1) === '/' ? f.dest : f.dest + '/';

    // delete existing huxleyfile
    grunt.file.delete(huxleyFile,{force:true});

    var huxleyTests = [];

    var huxleyAction = JSON.stringify([{"action":"screenshot"}]);

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          
          var file_name = filepath.split('/');
          file_name = file_name[file_name.length -1].split('.');
          file_name = file_name[0].replace(' ','-');

          var len = options.screenSizes.length;
          for (var i = 0; i < len; i++) {
            var url = options.rootUrl.charAt(options.rootUrl.length - 1) === '/' ? options.rootUrl : options.rootUrl + '/';
            var obj = {};
            obj.name = file_name + '-'+options.screenSizes[i].name;
            obj.screenSize = options.screenSizes[i].size;
            obj.url = url + file_name + '.html' + options.queryString;
            huxleyTests.push(obj);
            grunt.file.write(f.dest + file_name + '.hux/'+'record.json',huxleyAction);
          }
          return true;
        }
      });
      
    });
    

    // Write the destination file.
    var data = JSON.stringify(huxleyTests);
    grunt.file.write(f.dest + options.huxleyFile , data);

    // Print a success message.
    grunt.log.writeln('File "' + f.dest + '" created.');

  });

};
