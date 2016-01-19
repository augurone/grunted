module.exports = function (grunt) {
	'use strict';
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		pkgname: '<%=pkg.name%>',
		versn: 'v<%= pkg.version %>',
		datestr: '<%= grunt.template.today("mm-dd-yyyy, h:MM:ss TT") %>',
		banner: '/*\n<%=pkgname%>_<%=versn%>_<%=datestr%>'+'\n'.concat(grunt.file.read('LICENSE.txt'), '*/\n\n'),
		clean: ['build'],
		concat: {
			options: {
				banner: '<%=banner%>',
				stripBanners: false
			},
			distjs: {
				src: ['build/js/<%=pkg.name%>.js'],
				dest: 'build/js/<%=pkg.name%>.js'
			},
			distminjs: {
				src: ['build/js/<%=pkg.name%>.min.js'],
				dest: 'build/js/<%=pkg.name%>.min.js'
			},
			distmincss: {
				src: ['build/css/<%=pkg.name%>.min.css'],
				dest: 'build/css/<%=pkg.name%>.min.css'
			}
		},
		concurrent: {
			js: [
				'jshint',
				'jscs',
				'requirejs:combine',
				'requirejs:compile'
			],
			css: [
				'less:dist',
				'less:min'
			],
			minify: [
				'concat:distjs',
				'concat:distminjs',
				'concat:distmincss'
			]
		},
		requirejs: {
			options: {
				baseUrl: 'src/js',
				include: ['main'],
				name: '../../node_modules/almond/almond',
				mainConfigFile: 'src/js/config.js',
				wrap: true
			},
			combine: {
				options: {
					optimize: 'none',
					out: 'build/js/<%=pkg.name%>.js'
				}
			},
			compile: {
				options: {
					out: 'build/js/<%=pkg.name%>.min.js'
				}
			}
		},
		jscs: {
			main: [
				'src/js/**/*.js',
				'!**/*jquery*'
			],
			options: grunt.file.readYAML('jscs.yml')
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/js/.jshintrc'
				},
				files: {
					src: 'src/js/**/*.js'
				}
			}
		},
		less: {
			dist: {
				options: {
					banner: '<%=banner%>',
					plugins: [
						new (require('less-plugin-autoprefix'))({
							browsers: ['last 2 versions']
						}),
						new (require('less-plugin-clean-css'))({
							advanced: true,
							keepBreaks: true
						})
					]
				},
				files: {
					'build/css/<%=pkg.name%>.css': 'src/less/main.less'
				}
			},
			min: {
				options: {
					plugins: [
						new (require('less-plugin-autoprefix'))({
							browsers: ['last 2 versions']
						}),
						new (require('less-plugin-clean-css'))({
							advanced: true
						})
					]
				},
				files: {
					'build/css/<%=pkg.name%>.min.css': 'src/less/main.less'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-string-replace');

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build',['clean','concurrent:js','concurrent:css', 'concurrent:minify']);

};
