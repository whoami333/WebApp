//引入gulp模块
var gulp = require('gulp');

//通过 $ 引入其他gulp模块
var $ = require('gulp-load-plugins')(); //注意：这里需要实例化 ， 否则无法通过 $ 引用

//引入open模块
var open = require('open');

//定义目录路径
var app = {
	srcPath:'src/',  //源代码目录
	devPath:'build/',  //整合之后的文件，开发环境文件目录
	prdPath:'dist/'  //生产部署目录
};

//定义任务  拷贝angularJS文件
gulp.task('lib',function(){
	gulp.src('bower_components/**/*') //读取文件
	.pipe(gulp.dest(app.devPath + 'vendor')) //拷贝
	.pipe(gulp.dest(app.prdPath + 'vendor'))
	.pipe($.connect.reload());  //通知服务器刷新浏览器  IE8不支持
});

//定义任务   拷贝html文件
gulp.task('html',function(){
	gulp.src(app.srcPath + '**/*.html') //读取文件
	.pipe(gulp.dest(app.devPath)) //拷贝
	.pipe(gulp.dest(app.prdPath))
	.pipe($.connect.reload());
});

//定义任务   拷贝json文件
gulp.task('json',function(){
	gulp.src(app.srcPath + 'data/**/*.json') //读取文件
	.pipe(gulp.dest(app.devPath + 'data')) //拷贝
	.pipe(gulp.dest(app.prdPath + 'data'))
	.pipe($.connect.reload());
});

//定义任务  拷贝less文件
gulp.task('less',function(){
	gulp.src(app.srcPath + 'style/index.less') //读取文件
	.pipe($.less())   //通过 $ 进行less文件编译
	.pipe(gulp.dest(app.devPath + 'css'))
	.pipe($.cssmin()) //压缩CSS 
	.pipe(gulp.dest(app.prdPath + 'css'))
	.pipe($.connect.reload());
});

//定义任务 拷贝js文件
gulp.task('js',function(){
	gulp.src(app.srcPath + 'script/**/*.js')
	.pipe($.concat('index.js')) //整合js文件
	.pipe(gulp.dest(app.devPath + 'js'))
	.pipe($.uglify())  //压缩js文件  -> 放置生产环境
	.pipe(gulp.dest(app.prdPath + 'js'))
	.pipe($.connect.reload());
});


//定义任务 拷贝img文件
gulp.task('image',function(){
	gulp.src(app.srcPath + 'image/**/*')
	.pipe(gulp.dest(app.devPath + 'image'))
	.pipe($.imagemin())  //压缩img文件  -> 放置生产环境
	.pipe(gulp.dest(app.prdPath + 'image'))
	.pipe($.connect.reload());
});


//定义任务  清除旧文件
gulp.task('clean',function(){
	gulp.src([app.devPath,app.prdPath])
	.pipe($.clean())	
});

//定义任务  打包整个任务
gulp.task('build',['image','js','less','lib','html','json']);

//定义任务  服务自动化还需要编译
gulp.task('serve',['build'],function(){
	$.connect.server({   //启动服务器
		root:[app.devPath],   //服务器路径
		livereload:true,      //自动刷新浏览器
		port:1431      //自定义端口   
	});
	open('http://localhost:1431');  //自动打开浏览器
	
	
	//监听文件变化 自动构建代码  需要在每个任务后面加上.pipe($.connect.reload())才能自动刷新浏览器  ie8不支持;
	gulp.watch(app.srcPath + '**/*.html',['html']);
	gulp.watch(app.srcPath + 'style/**/*.less',['less']);
	gulp.watch(app.srcPath + 'script/**/*.js',['js']);
	gulp.watch(app.srcPath + 'data/**/*.json',['json']);
	gulp.watch(app.srcPath + 'image/**/*',['image']);
	gulp.watch('bower_components/**/*',['lib']);
});


//更改默认任务
gulp.task('default',['serve']);
