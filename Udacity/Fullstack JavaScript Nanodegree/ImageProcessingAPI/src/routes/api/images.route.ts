import express from 'express';
import fs from 'fs';
import path from 'path';
import { outputPath, resizeImage } from '../../util/image-manipulation.util';
import { NullableError, NullableString } from '../../util/types.util';

// ANCHOR: - Top-Level Constants

const images = express.Router();

// ANCHOR: - Types

type ImageQuery = {
    imageName?: string;
    width?: string;
    height?: string;
};

// ANCHOR: - Helper Functions

const renderParamError = (message: string, res: express.Response): void => {
    res.status(400);
    res.render('param-error.liquid', { message });
};

const checkFileExists = (filePath: string): boolean => {
    return fs.existsSync(filePath);
};

// ANCHOR: - Routes

images.get('/', (req: express.Request, res: express.Response): void => {
    if (Object.entries(req.query).length === 0) {
        // Render generic API template
        res.render('api.liquid', {
            endpoint: '/api/images'
        });
    } else {
        // Type cast query object
        const query = (req.query as ImageQuery);

        // Check for required URL parameters
        if (!query.imageName) {
            renderParamError('URL parameter <code>imageName</code> is missing.', res);
            return;
        } else if (!query.width) {
            renderParamError('URL parameter <code>width</code> is missing.', res);
            return;
        }

        // Get URL parameters
        const imageName = query.imageName;
        const width = Number(query.width);
        const height = query.height ? Number(query.height) : width;

        // Check for NaN
        if (!width) {
            renderParamError('The width provided is not a number.', res);
            return;
        } else if (!height) {
            renderParamError('The height provided is not a number.', res);
            return;
        }

        // Check if file already exists
        const futureOutputPath = outputPath(imageName, { width, height });
        if (checkFileExists(futureOutputPath)) {
            // Send existing file
            res.sendFile(path.resolve(futureOutputPath));
        } else {
            // Attempt to resize image
            resizeImage(imageName, width, height, (err: NullableError, outputPath: NullableString): void => {
                if (err) {
                    renderParamError(`<code>${imageName}</code> image does not exist.`, res);
                } else {
                    outputPath = (outputPath as string);
                    res.sendFile(path.resolve(outputPath));
                }
            });
        }
    }
});

export default images;
