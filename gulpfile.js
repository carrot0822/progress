var gulp = require('gulp');
var scss = require('gulp-sass'); 
var postcss = require('gulp-postcss'); // css处理插件
var rename = require('gulp-rename'); // 更改文件名
var replace = require('gulp-replace'); // 替换内容？哪部分的 替换文件内部的内容
var changed = require('gulp-changed'); // 检测改动
var autoprefixer = require('autoprefixer'); // 自动添加前缀
var del = require('del'); // 删除文件和文件夹

// src语法 important 禁用 问题不大 可以不用 但是解决方法要弄

gulp.task("scss",(done)=>{
    
    gulp.src(['src/**/**/*.scss'],{base:'src'})

    .pipe(scss())
    .pipe(postcss([autoprefixer(['iOS >= 8','Android >= 4.1'])]))
    .pipe(
        rename((path) =>{
            path.extname = '.wxss';
        })
    )
    .pipe(changed('dist'))
    
    .pipe(gulp.dest('dist'))
    done();
})

 gulp.task('copy',(done)=>{
    
    gulp.src(['src/**','!src/**/**/*.scss'],{base:'src'})
    .pipe(changed('dist'))
    
    .pipe(gulp.dest('dist'))
    done();
})
gulp.task('clean',(done) =>{
    del(['dist/**/*'],done());
})
gulp.task('watch',(done)=>{
    gulp.watch('src/**',gulp.series(['scss','copy']))
})

gulp.task('default',gulp.parallel(['watch','scss','copy'])) 

// 处理思路
// 无法进行删除操作 小程序是有缓存且无热更新的 删除文件后（大批量 需要重启一次
