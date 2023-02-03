import fs from 'fs';
import { resizeImage } from '../../src/util/image-manipulation.util';
import { NullableError, NullableString } from '../../src/util/types.util';

// ANCHOR: - Top-Level Constants

const thumbnailDirPath = './public/assets/images/thumb';

// ANCHOR: - Helper Functions

const removeDirectory = (dir: string): void => {
    try {
        fs.rmdirSync(dir, { recursive: true });
    } catch (err) {
        console.error(`Error while trying to delete ${dir}.`);
    }
};

// SECTION: - Image Processing Utility Tests

describe('Image Processing Utility Tests', (): void => {

    // ANCHOR: - Tests for resizeImage() Function

    describe('Tests for resizeImage() Function', (): void => {

        it('Resizing Existing Image Returns Correct Output Path', (done: DoneFn): void => {
            removeDirectory(thumbnailDirPath);
            resizeImage('santamonica', 200, 300, (err: NullableError, outputPath: NullableString): void => {
                expect(err).toBeNull();
                expect(outputPath).toBe(`${thumbnailDirPath}/santamonica_w200h300.jpg`);
                done();
            });
        });

        it('Resizing Non-Existing Image Returns Error', (done: DoneFn): void => {
            removeDirectory(thumbnailDirPath);
            resizeImage('test', 200, 300, (err: NullableError, outputPath: NullableString): void => {
                expect(outputPath).toBeNull();
                expect(err).toBeTruthy();
                done();
            })
        });

    });

});
