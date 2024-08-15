import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
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

// NodeJs code to search for all the images on the project and apply the processImage function
export async function images(done) {
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        processImages(file, outputSubDir);
    });
    done();
}

// NodeJs code to generate a Webp version of a jpg image
function processImages(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}


export const dev = () => {
	watch('src/scss/**/*.scss', css)
	watch('src/js/**/*.js', js)
	watch('src/img/**/*.{png,jpg}', images)
}

export default series( js, css, crop, images, dev)