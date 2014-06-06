module.exports = function(grunt) {
'use strict';

	grunt.initConfig({

		pkg: require('./package'), // <%=pkg.name%>

		/**
		 * Config - Edit this section
		 * ==========================
		 * Choose javascript dist filename
		 * Choose javascript dist location
		 * Choose javascript files to be uglified
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

		banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today(\'yyyy\') %> @mrmartineau | <%= pkg.homepage %> */\n',

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
				compress: false,
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

		watch: {
			js: {
				files: ['<%= config.js.srcDir %>/<%= config.js.filename %>.js', 'Gruntfile.js'],
				tasks: ['uglify']
			},
		}

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
		'copy'
	]);

	// grunt.registerTask('travis', [
	// 	'jshint',
	// 	'jasmine'
	// ]);

};
