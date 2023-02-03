import sharp from 'sharp';
import fs from 'fs';

// ANCHOR: - Types

type ImageDimensions = {
    width: number;
    height: number;
};

// ANCHOR: - Helper Functions

const inputPath = (imageName: string): string => {
    return `./public/assets/images/full/${imageName}.jpg`
};

const outputPath = (imageName: string, dimensions: ImageDimensions): string => {
    return `./public/assets/images/thumb/${imageName}_w${dimensions.width}h${dimensions.height}.jpg`
};

// ANCHOR: - Public Functions

function resizeImage(
    imageName: string,
    width: number,
    height: number,
    callback: (err: Error | null, outputPath: string | null) => void) {

    // Check if thumbnail folder exists
    if (!fs.existsSync('./public/assets/images/thumb')) {
        fs.mkdirSync('./public/assets/images/thumb');
    }

    // Generate new image
    sharp(inputPath(imageName))
        .resize(width, height)
        .toFile(outputPath(imageName, { width, height }), (err, _) => {
            if (err !== null) {
                callback(err, null);
            } else {
                callback(null, outputPath(imageName, { width, height }));
            }
        });
}

export { resizeImage, outputPath };
