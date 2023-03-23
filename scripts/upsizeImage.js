import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'

// Input and output file paths
const inputFile = 'images/mooman.png';
const outputFile = 'images/upsized-mooman.png';

function execute() {

  // Create a new canvas object with the same dimensions as the desired output
  const canvas = createCanvas(16, 16);
  const ctx = canvas.getContext('2d');

  // Load the image file using fs
  const imgData = fs.readFileSync(inputFile);

  // Create a new canvas and load the image onto it
  loadImage(imgData).then(image => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Define a scaling factor
    const scalingMultiplier = 64;

    // Create a new canvas object with scaled dimensions
    const outputCanvas = createCanvas(image.width * scalingMultiplier, image.height * scalingMultiplier);
    const outputCtx = outputCanvas.getContext('2d');

    // Loop over the image data and draw each pixel onto the output canvas
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const index = (y * imageData.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const a = imageData.data[index + 3];
        outputCtx.fillStyle = `rgba(${r},${g},${b},${a})`;
        outputCtx.fillRect(x * scalingMultiplier, y * scalingMultiplier, scalingMultiplier, scalingMultiplier);
      }
    }

    // Save the canvas as a new png image
    const stream = outputCanvas.createPNGStream();
    const out = fs.createWriteStream(outputFile);
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was saved.'));
  });

}

execute()