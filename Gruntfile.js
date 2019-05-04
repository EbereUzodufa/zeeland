module.exports = function(grunt) {
  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im'
        },
        sizes: [{
          width: 480,
          suffix: '_small',
          quality: 90
        }],
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png,jpeg}'],
          cwd: 'images/properties/',
          dest: 'imgSrc/'
        }]
      }
    },
     /* Clear out the images directory if it exists */
    clean: {
        dev: {
            src: ['imgSrc'],
        },
    },
  
    /* Generate the images directory if it is missing */
    mkdir: {
        dev: {
          options: {
            create: ['imgSrc']
          },
        },
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          src: ['images/fixed/*.{gif,jpg,png}'],
          dest: 'imgSrc/',
          flatten: true,
        }]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  
  grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images']);
}