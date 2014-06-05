module.exports = function(grunt) {
  
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'js/main.min.js': ['js/**/*.js']
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'css/main.min.css': ['css/normalize.css', 'css/main.css']
        }
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js']
    }

    });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['uglify','cssmin']);


};