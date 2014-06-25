module.exports = function(grunt) {
'use strict';

	grunt.initConfig({

		pkg: require('./package'), // e.g. <%=pkg.name%>

		/**
		 * Config - Edit this section
		 */
		config : {
			js : {
				// <%=config.js.srcDir%>
				srcDir   : 'src/',
				// <%=config.js.distDir%>
				distDir  : 'dist/',
				// <%=config.js.filename%>
				filename : 'trak'
			}
		},

		banner: '/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today(\'yyyy\') %> @mrmartineau | <%= pkg.homepage %>\n   Universal event tracking API. */\n',

		jshint: {
			all: '<%=config.js.srcDir%><%=config.js.filename%>.js',
			options: {
				jshintrc: '.jshintrc'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				mangle: true,
				beautify: false,
				compress: true,
				report: 'gzip'
			},
			js: {
				src: '<%= config.js.srcDir %><%=config.js.filename%>.js',
				dest: '<%=config.js.distDir%><%=config.js.filename%>.min.js'
			}
		},

		copy: {
			dist: {
				src: '<%= config.js.srcDir %>/<%= config.js.filename %>.js',
				dest: '<%= config.js.distDir %><%= config.js.filename %>.js',
			},
		},

		concat: {
			dist: {
				src: '<%= config.js.srcDir %>/<%= config.js.filename %>.js',
				dest: '<%= config.js.distDir %><%= config.js.filename %>.js',
			},
			options: {
				stripBanners: true,
				banner: '<%= banner %>'
			}
		},

		watch: {
			js: {
				files: ['<%= config.js.srcDir %>/<%= config.js.filename %>.js', 'Gruntfile.js'],
				tasks: ['uglify', 'concat']
			},
		},

		connect: {
			server: {
				options: {
					open: true
				}
			}
		},

		// jasmine : {
		// 	src : 'src/**/*.js',
		// 	options : {
		// 		specs : 'test/**/*-spec.js'
		// 	}
		// }
	});

	// Load all the grunt tasks
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', [
		'jshint',
		'uglify',
		'concat'
	]);

	grunt.registerTask('serve', [
		'connect',
		'watch'
	]);

	grunt.registerTask('travis', [
		'jshint'
	]);

};
