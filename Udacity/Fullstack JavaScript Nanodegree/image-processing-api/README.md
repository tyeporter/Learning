# image-processing-api &#x1F5BC;

This application allows users to resize sample images. You can access the API by going to the `/api/images` endpoint.

<br>

The `/api/images` endpoint takes following URL parameters:
- `imageName` (Required)
- `width` (Required)
- `height` (Optional)

<br>

For example, visiting the URL below will resize the sample image `santamonica.jpg` to a size of `200` pixels width and `300` pixels height:

```
http://localhost:3000/api/images?imageName=santamonica&width=200&height=300
```

The resized image will be generated on-disk and sent to the end user. The resized images can be found in `public/assets/images/thumb`.

<br>

Below are the sample image names you can use:
- `encenadaport`
- `fjord`
- `icelandwaterfall`
- `palmtunnel`
- `santamonica`

Or you can use your own images by copying them into the `public/assets/images/full` folder.


<br>

## Folder Structure and File Naming Conventions

The folder structure I used for this project was one that I felt was good for separating responsibility:

```
dist/
public/
|-- assets
    |-- images/
src/
|-- index.ts
|-- routes/
    |-- api.route.ts
    |-- api/
        |-- users.route.ts
|-- util
    |-- my-tool.util.ts
|-- views/
    |-- view-a.liquid
    |-- view-b.liquid
spec/
tests/
|-- helpers/
|-- routes/
|-- util/
```

- `dist/` contains the transpiled JavaScript
- `public/` contains all static content (images, client-side scripts, stylesheets)
- `src/` contains server-side specific TS / JS files
- `spec/` contains specifications for unit tests
- `tests/` contains all unit tests for the application

<br>

For file naming, I used a convention similar to what the Angular team describes in it's [style guide](https://angular.io/guide/styleguide).

<br>

## Running the Project

To run the project:
1. Download the source code from this repository
2. Open your terminal and `cd` into the project folder
3. Install the dependencies by using  `npm install` or `npm i`
4. Run the application using `npm run start`

### Testing

The [Jasmine](https://www.npmjs.com/package/jasmine) test suite can be ran using the following command:

```npm run test```

### Building

To build the project, use the following command:

```npm run build```

After running the `build` command, a  `/dist` folder will be generated with the transpiled `.js` files.

<br>

## Technologies

This application was built using the following technologies:

- Node.js
- [Express](https://www.npmjs.com/package/express)
- [TypeScript](https://www.npmjs.com/package/typescript)
- [Sharp](https://www.npmjs.com/package/sharp)
- [LiquidJS](https://www.npmjs.com/package/liquidjs)

<br>

## Contributors
This project is maintained by the following people:
<p>
    <a href="https://github.com/tyeporter">
        <img src="https://avatars1.githubusercontent.com/u/16263420?s=460&v=4" width="100" height="100" />
    </a>
</p>
