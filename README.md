<p align='center'>
TDD chess game built with TS
</p>

<p align='center'>
Based on @antfu's <b> <a href="https://github.com/antfu/vitesse">Vitesse</a></b> <sup><em>(speed)</em> </sup> awesome starter
</p>

<br>

<p align="center">
<img src="./public/screenshot.png" width="450" alt="screenshot">

</p>

<p align='center'>
<a href="https://fastidious-swan-5709df.netlify.app/">Live Demo</a>
</p>

<br>

<br>

## Usage

### Development

Just run and visit http://localhost:3333

```bash
pnpm dev
```

### Build

To build the App, run

```bash
pnpm build
```

And you will see the generated file in `dist` that ready to be served.

### Deploy on Netlify

Go to [Netlify](https://app.netlify.com/start) and select your clone, `OK` along the way, and your App will be live in a minute.

### Docker Production Build

First, build the vitesse image by opening the terminal in the project's root directory.

```bash
docker buildx build . -t vitesse:latest
```

Run the image and specify port mapping with the `-p` flag.

```bash
docker run --rm -it -p 8080:80 vitesse:latest
```

