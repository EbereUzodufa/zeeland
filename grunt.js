grunt.initConfig({
    responsive_images: {
      dev: {
        options: {},
        sizes: [{
          width: 320,
          height: 240
        },{
          name: 'large',
          width: 640
        },{
          name: "large",
          width: 1024,
          suffix: "_x2",
          quality: 0.6
        }],
        files: [{
          expand: true,
          src: ['app/img/**/*.{jpg,gif,png}'],
          cwd: 'images/',
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
          src: ['**/*', '!app/img/**/*.*'],
          cwd: 'images/',
          dest: 'imgSrc/'
        }]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  
  grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images']);