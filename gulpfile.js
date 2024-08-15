import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import {src, dest, watch, series} from 'gulp'
import * as dartSass from 'sass'; 
import gulpSass from 'gulp-sass';
import terser from 'gulp-terser';

const sass = gulpSass(dartSass);

export const js = ( done ) => {
	src('src/js/app.js')
		.pipe(terser()) // Terser minifies the js file
		.pipe( dest('build/js') )

	done()
}

export const css = (done) => {
	src('src/scss/app.scss', {sourcemaps: true})
		.pipe( sass({ outputStyle: 'compressed' }).on('error', sass.logError) )
		.pipe( dest('build/css',  {sourcemaps: '.'}) )

	done()
}

// NodeJs code to crop images on gallery
export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}


export const dev = () => {
	watch('src/scss/**/*.scss', css)
	watch('src/js/**/*.js', js)
}

export default series( js, css, crop, dev)