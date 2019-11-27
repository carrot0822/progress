const gulp = require('gulp');
const scss = require('gulp-sass');
const postcss = require('gulp-postcss'); // css处理插件
const rename = require('gulp-rename'); // 更改文件名
const replace = require('gulp-replace'); // 替换内容？哪部分的 替换文件内部的内容
const changed = require('gulp-changed'); // 检测改动
const autoprefixer = require('autoprefixer'); // 自动添加前缀
const del = require('del'); // 删除文件和文件夹
const tap = require('gulp-tap');
const path = require('path');
const clean = require('gulp-clean');
// src语法 important 禁用 问题不大 可以不用 但是解决方法要弄

const config = {
    cssFilterFiles: ['scss/var.scss','scss/mixin.scss'],
}

const hasRmCssFiles = new Set();
/**
 * 需要做的事情
 * 由于微信小程序自身有import功能 scss也有 而scss的import会把引入的文件编写打包到当前css文件内 会导致包越来越大
 * 所以在编译前 我们需要先把scss里面的import给注释掉 让scss打包忽略掉后 在打包编译后再取消注释并改变后缀
 * 但是如果在scss中使用了变量 函数这些功能 那么就必须要编译打包 编译打包后要删除多余的编译文件
 * 为了识别出哪一些import是需要编译 哪一些不需要编译 需要提前写入一个过滤数组 当匹配到这个字段的时候就先提前此时的路径
 * 把scr替换为dist scss替换为wxss（因为这是打包后的路径）用于后续的删除
 * 然后就可以进行正则匹配 把不在过滤数组内的引入全部注释
 * 进行scss编译 编译结束后打开注释 并把import路径scss替换为wxss
 * 再把文件后缀名重命名 压缩到dist即可 完成scss到wxss的编译
 * 1.
 */
gulp.task('scss', () => gulp.src('./src/**/*.{scss,wxss}')
    .pipe(tap((file) => {
        // 当前处理文件的路径
        const filePath = path.dirname(file.path);
        // 当前处理内容
        const content = file.contents.toString();
        // 找到filter的scss，并匹配是否在配置文件中
        content.replace(/@import\s+['|"](.+)['|"];/g, ($1, $2) => {
            // filter创建一个新数组 新数组的元素是通过校检函数操作过的数据
            const hasFilter = config.cssFilterFiles.filter(item => $2.indexOf(item) > -1);
            // hasFilter > 0表示filter的文件在配置文件中，打包完成后需要删除
            if (hasFilter.length > 0) {
                const rmPath = path.join(filePath, $2);
                // 将src改为dist，.scss改为.wxss，例如：'/xxx/src/scss/const.scss' => '/xxx/dist/scss/const.wxss'
                const filea = rmPath.replace(/src/, 'dist').replace(/\.scss/, '.wxss');
                // 加入待删除列表
                hasRmCssFiles.add(filea);
            }
        });
        console.log('rm', hasRmCssFiles);
    }))
    .pipe(replace(/(@import.+;)/g, ($1, $2) => {
        const hasFilter = config.cssFilterFiles.filter(item => $1.indexOf(item) > -1);
        if (hasFilter.length > 0) {
            return $2;
        }
        return `/** ${$2} **/`;
    }))
    .pipe(scss().on('error', scss.logError))
    .pipe(postcss([autoprefixer(['iOS >= 8','Android >= 4.1'])])) // 这里还可以添加更多浏览器 不过我只设定了手机系统
    .pipe(replace(/(\/\*\*\s{0,})(@.+)(\s{0,}\*\*\/)/g, ($1, $2, $3) => $3.replace(/\.scss/g, '.wxss')))
    .pipe(rename({
        extname: '.wxss',
    }))
    .pipe(gulp.dest('./dist')));


gulp.task('copy', (done) => {

    gulp.src(['src/**', '!src/**/**/*.scss'], {
            base: 'src'
        })
        .pipe(changed('dist'))

        .pipe(gulp.dest('dist'))
    done();
})
gulp.task('cleanWxss',(done)=>{
    const arr = []
    hasRmCssFiles.forEach((item)=>{
        arr.push(item)
    })
    return gulp.src(arr,{read: false})
            .pipe(clean({force:true}))
})

gulp.task('clean', (done) => {
    del(['dist/**/*'], done());
})
gulp.task('watch', (done) => {
    gulp.watch('src/**', gulp.series(['scss', 'copy','cleanWxss']))
})

gulp.task('default', gulp.parallel(['watch', 'scss', 'copy']))

// 处理思路
// 无法进行删除操作 小程序是有缓存且无热更新的 删除文件后（大批量 需要重启一次
// 遇到含有变量的包 他是先导入再处理编译为css文件 而这些包在后续是不需要的 所以有了待删除列表