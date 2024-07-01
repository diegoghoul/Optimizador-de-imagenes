import fs from 'fs-extra';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';

let inputFolder = 'scr';
let outputFolder = 'opt';
let targetWidth = 1920;

const processImg = async () => {
  try {
    if (!await fs.pathExists(inputFolder)) {
      throw new Error(`Input folder "${inputFolder}" does not exist.`);
    }
    if (!await fs.pathExists(outputFolder)) {
      await fs.mkdir(outputFolder);
    }

    const files = await fs.readdir(inputFolder);
    for (const file of files) {
      let inputPath = `${inputFolder}/${file}`;
      let outputPath = `${outputFolder}/${file}`;

      console.log(`Processing ${inputPath} -> ${outputPath}`);

      await sharp(inputPath)
        .resize(targetWidth)
        .toFile(outputPath);

      await imagemin([outputPath], {
        destination: outputFolder,
        plugins: [
          imageminJpegtran(),
          imageminPngquant(),
          imageminSvgo({
            plugins: [{
              name: 'removeViewBox',
              active: false
            }]
          }),
          imageminGifsicle({ quality: 80 }),
          imageminWebp()
        ]
      });

      console.log(`Processed and optimized ${outputPath}`);
    }
  } catch (err) {
    console.error('Error processing images:', err);
  }
}

processImg();
