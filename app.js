const sharp = require('sharp');
const compress_images = require('compress-images');
const fs = require('fs');

const path = process.argv[2];
const width = Number(process.argv[3]);

function resize(path, width) {
  sharp(path).resize({ width: width }).toFile('./temp/output.jpg', (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Imagem redimensionada com sucesso!');
    compress('./temp/output.jpg', './compressed/')
  });  
}

function compress(path, output) {
  compress_images(path, output, { compress_force: false, statistic: true, autoupdate: true }, false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (error, completed, statistic) {
      console.log("-------------");
      console.log(error);
      console.log(completed);
      console.log(statistic);
      console.log("-------------");
        
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
        console.log(path, 'apagado!')
      })
    }
  );
}

resize(path, width)
