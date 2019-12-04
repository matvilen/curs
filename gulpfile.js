    /*eslint-disable node/no-unpublished-require*/
    //сначала нужно все скомпелировать, поэтому подключаем плагины, кот-е обозначим через const
    const gulp = require('gulp');                       //инструмент сборки(для простых систем), позволяет оперировать потоками, а не файлами
    const sass = require('gulp-sass');                  //работает с потоками - обработал 1ый -> переливает во 2ой -> 3ий
    const concat = require('gulp-concat');              // Подключаем gulp-concat (для конкатенации файлов) - не использую
    const plumber = require('gulp-plumber');            //вывод ошибок
    const autoprefixer = require('gulp-autoprefixer');  //у браузеров постепенно появляются новые ф-ции, 
                                                        //кот не закреплены в стандарте css, чтобы поддерживать
                                                        // эти ф-ции браузеры создают префиксы-css
    const cssnano = require('gulp-cssnano');            // сжимает css(убирает пробелы) -  документ с пробелами весит больше                                             
    const nodemon = require('nodemon');
    const uglify = require('gulp-uglifyjs')
    /*eslint-enable node/no-unpublished-require*/

        //puzzle for sсss   
    gulp.task('scss',()=>{ 
        return gulp
        .src('dev/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())                                    // .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
                                                         // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(
            autoprefixer(['last 10 versions', '> 1%', 'ie 9', 'ie 10'],{ //пишем на современном станарте, но 
                cascade: true                                            //старые будут поддерживать (браузеры и т.д.)
            })
        )
        .pipe(cssnano()) 
        .pipe(gulp.dest('public/stylesheets/'),() => {
        })
      });
    
    gulp.task('watch', gulp.series(function (){          //эта команда отслеживает изменения, т.е. если я что-то поменяю
        nodemon.restart();
    }));   

    gulp.task('serveR',()=> {
        nodemon({
            script: 'app.js',
            watch: ["app.js", "gulpfile.js", 'public/*', 'public/*/**', 'dev/*'],
            ext: 'js'
        }).on('restart', () => {
            gulp.src('app.js')
        });
    });  

    gulp.task('scripts', () =>
       gulp
        .src([
            'dev/js/auth.js',
            'dev/js/report.js',
            'node_modules/medium-editor/dist/js/medium-editor.min.js'
            //
        ])
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/javascripts'))
    );


    var html = gulp.watch('views/**/*.ejs');                //в dist/*.html, то сразу поменяется отображение данных
    html.on('change', ()=> {
      console.log('you changed the ejs');
    //  nodemon.notify("Compiling, please wait!");
    //  nodemon.reload('views/**/*.ejs');
    });

    var scripts = gulp.watch('dev/js/**/*.js');
    scripts.on('change', gulp.series('scripts'),()=>{
        console.log('you changed the scripts');
    })
    
    var css = gulp.watch('dev/scss/**/*.scss');          //в dev/scss/*.scss, то сразу поменяется отображение данных
    css.on('change', gulp.series('scss'),() => {           
      console.log('you changed the scss');
    //  nodemon.notify("Injecting CSS!");       nodemon.reload('public/**/*.css');
    });  

        //задачи gulp`a - не перетаскивай вверх, тут объявляю, то что было скомпилировано выше(ф-ции)
    gulp.task('default',gulp.series('serveR','scss','scripts'),()=>{         //выполняется автоматически, при запуске дефолтного таска
                                                                         //будет ещё запускаться "scss" и 'browser-sync'
    });
    
    