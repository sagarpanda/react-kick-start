# Kick start react application with Webpack v2.0

### Configured Features

 - ES6 With Spread operator
 - Transpiling JSX
 - CSS Loader and extract plugin
 - url-loader for images and fonts

### NPM Installation
 ```sh
 $ npm i -D react-kick-start
 ```

### USE
In webpack.config.js

```javascript
const config = require('react-kick-start/lib/webpack.config');
module.exports = config(options);
```
`options` are as follows...

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| outputPath | string | production |
| port | number | 3000 |
