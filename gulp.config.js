module.exports = function() {
	var config = {
        temp: './src/.tmp/',
        js: [
            './src/js/'
        ],
        index: './src/index.html',
        templates: './src/templates/*.hbs',
        less: [
            './src/css/style.less'
        ],
        allless: './src/css/*.less',
        alljs: './src/js/**/*.js',
    };
	return config;
}