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
    },

    connect: {
      server: {
        options: {
          port: 9001,
          open: true,
          keepalive: true
        }
      }
    }

    });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['uglify','cssmin','connect']);


};