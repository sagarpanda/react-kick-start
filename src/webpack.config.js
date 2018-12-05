import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer';
import TransformImports from 'babel-plugin-transform-imports';
import ldTrim from 'lodash/trim';

const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin;

const ROOT_DIR = process.cwd();
const REPORT_DIR = 'report'; // relative path to build dir
const APP_DIR = path.resolve(ROOT_DIR, 'app');

const PROD_ENV = 'production';
const env = ldTrim(process.env.NODE_ENV) || 'development';

const getPath = (depName) => {
  const pt = require.resolve(depName);
  return pt;
};

const loaders = {
  // .css
  cssLoader: () => {
    const sourceMap = env !== PROD_ENV;
    return {
      test: /\.css$/,
      // exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: {
          loader: getPath('style-loader')
        },
        use: [{
          loader: getPath('css-loader'),
          options: { sourceMap }
        }]
      })
    };
  },
  // .svg | .png
  imgLoader: () => ({
    loader: getPath('url-loader'),
    options: { limit: 10 },
    test: /\.(svg|gif|jpg|jpeg|png|woff|woff2|eot|ttf)$/
  }),
  // .js | .jsx
  jsxLoader: () => {
    const transformImport = [
      TransformImports, {
        'react-sugar-ui': {
          preventFullImport: true,
          transform: (importName) => `react-sugar-ui/lib/${importName}`
        }
      }
    ];
    return {
      exclude: /node_modules/,
      include: APP_DIR,
      test: /\.(js|jsx)?/,
      use: [
        {
          loader: getPath('babel-loader'),
          options: {
            babelrc: false,
            plugins: [
              getPath('babel-plugin-transform-object-rest-spread'),
              getPath('babel-plugin-transform-class-properties'),
              getPath('babel-plugin-lodash'),
              transformImport
            ],
            presets: [
              getPath('babel-preset-env'),
              getPath('babel-preset-react')
            ]
          }
        }
      ]
    }
  }
};
const plugins = {
  bundleAnalyzerPlugin: () => new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    generateStatsFile: true,
    openAnalyzer: false,
    reportFilename: `${REPORT_DIR}/bundle-analyzer.html`,
    statsFilename: `${REPORT_DIR}/stats.json`
  }),
  chunkPlugin: () => new webpack.optimize.CommonsChunkPlugin({
    filename: 'vendor.js',
    minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1,
    name: 'vendor'
  }),
  definePlugin: () => new webpack.DefinePlugin({ ENVIRONMENT: env }),
  extractCssPlugin: () => new ExtractTextPlugin('styles.css'),
  htmlPlugin: () => new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.resolve(__dirname, './index-build.html')
  }),
  ignorePlugin: () => new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  providePlugin: () => new webpack.ProvidePlugin({ Promise: 'bluebird' }),
  uglifyPlugin: () => new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      booleans: true,
      conditionals: true,
      dead_code: true,
      drop_console: true,
      drop_debugger: true,
      evaluate: true,
      sequences: true,
      unused: true,
      warnings: false,
    },
    output: {
      ascii_only: true
    }
  })
};

function getRules() {
  return [
    loaders.jsxLoader(),
    loaders.cssLoader(),
    loaders.imgLoader()
  ];
}

function getPlugins() {
  const common = [
    plugins.definePlugin(),
    plugins.extractCssPlugin(),
    plugins.providePlugin(),
    plugins.ignorePlugin(),
    plugins.chunkPlugin(),
    plugins.htmlPlugin()
  ];
  const forProd = [
    plugins.uglifyPlugin(),
    plugins.bundleAnalyzerPlugin()
  ];
  return env === PROD_ENV ? [...common, ...forProd] : [...common];
}


const defaultOptions = {
  outputPath: 'production',
  port: 3000
};

const webpackConfig = (options) => {
  const { outputPath, port } = { ...defaultOptions, ...options };
  const buildPath = path.resolve(ROOT_DIR, outputPath);

  const config = {
    devServer: { inline: true, port },
    devtool: env === PROD_ENV ? false : '#inline-source-map',
    entry: path.resolve(APP_DIR, 'main.js'),
    module: {
      rules: getRules()
    },
    output: {
      filename: 'bundle.js',
      path: buildPath
    },
    plugins: getPlugins(),
    resolve: {
      extensions: ['.js', '.jsx']
    }
  };

  return config;
}

module.exports = webpackConfig;
