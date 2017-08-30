/*

自定义的构建脚本
  1. 区分三套环境。 develop | testing | production
    `NODE_ENV=production npm run build`
  2. 多页面多入口
  3. 热替换
  4. proxy 解决接口跨域
  5. mock 接口数据
  6. iconfont 加载

依赖 package.json 中的 "entry", "title", "mockEnable", "proxy", "staticRoot" 配置项

author: meiqingguang

*/

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
const pkg = require('./package.json');
const MockServer = require('./mock/server.js');

// mock enable
// 将 http://example.com/api/path 的接口
// 转发到 http://localhost:8080/mock/data/api/path.json
if(pkg.mockEnable && process.argv[1].includes('webpack-dev-server')) {
  let port = 8088;
  MockServer.start(port);

  Object.keys(pkg.proxy).forEach(filter => {
    let proxy = pkg.proxy[filter];
    proxy.target = `http://localhost:${port}`; // mock server
  });
}

// 编译输出的文件路径，三套环境: develop | testing | production
// 当 NODE_ENV === production 时，文件放在 build/production/{pkg.version} 目录下。
// 不把 output.path 设为 build/production/{pkg.version} 而是保持 build/production
// 原因是为了保证 html 中的路径包含 {pkg.version} 版本号。
const env = process.env.NODE_ENV || 'develop';
const fileBase = env === 'production' ? `${pkg.version}/` : '';

let pathConfig = {
  assetPath: '/assets',
  cssVarIconUrl: '"/assets/iconfont/iconfont"',
  imageFile: 'assets/images/[name].[ext]',
  fontFile: 'assets/iconfont/[name].[ext]',
  htmlBase: '.',
  jsFile: '[name].js',
  cssFile: '[name].css',
  commonFile: 'common.js',
  cleanPath: `./build/${env}`,
  outputPath: path.resolve(__dirname, `./build/${env}`)
}
if (env === 'testing') {
  pathConfig.cssVarIconUrl = `"${pkg.staticRoot}/assets/iconfont/iconfont"`;
} else if (env === 'production') {
  pathConfig.assetPath = `/${pkg.version}/assets`;
  pathConfig.cssVarIconUrl = `"${pkg.staticRoot}/${pkg.version}/assets/iconfont/iconfont"`;
  pathConfig.imageFile = `${pkg.version}/assets/images/[name].[ext]`;
  pathConfig.fontFile = `${pkg.version}/assets/iconfont/[name].[ext]`;
  pathConfig.htmlBase = `./pages`;
  pathConfig.jsFile = `${pkg.version}/[name].js`;
  pathConfig.cssFile = `${pkg.version}/[name].css`;
  commonFile: `${pkg.version}/common.js`,
  pathConfig.cleanPath = `./build/${env}/${pkg.version}`;
}

// css 变量
let cssVars = {
  '@icon-url': pathConfig.cssVarIconUrl,
}

// webpack 配置
let webpackConfig = {
  entry: pkg.entry,
  output: {
    path: pathConfig.outputPath,    // 输出路径
    filename: pathConfig.jsFile,    // js 文件路径
    chunkFilename: pathConfig.jsFile,
    publicPath: `${pkg.staticRoot}/`
  },
  devtool: env === 'production' ? false : 'cheap-source-map',
  devServer: {
    /*
    package.proxy 格式参考：https://github.com/chimurai/http-proxy-middleware
    {
      "/path/**": {
        target: "http://example.com"
      }
    }
    */
    disableHostCheck: true,
    proxy: pkg.proxy || {}
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname, 'assets'),
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: require('os').tmpdir(),
          presets: ['es2015-ie', 'react', 'stage-0'],
          plugins: [
            'add-module-exports',
            'transform-runtime',
            ['import', { 'libraryName':'antd', 'style':true }], // antd 按需加载
          ],
        }
      }
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract([
        'css-loader',
        { loader:'less-loader', options: { modifyVars:cssVars } }
      ])
    }, {
      // 图片。将 30KB 以下的图片用 data-url 的 base64 加载，超出 30KB 的图片将使用 file-loader 保存为文件
      test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
      use: { loader:'url-loader', options: { 
        limit: 10000,
        name: pathConfig.imageFile // 指定文件名
      }}
    }, {
      // 字体。将 10KB 以下的字体用 base64 的 data-url 加载
      test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: { loader:'url-loader', options: { 
        limit: 10000, 
        name: pathConfig.fontFile
      }}
    }]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin(pathConfig.cssFile),
    new webpack.optimize.CommonsChunkPlugin({name:"common"}),
    new webpack.DefinePlugin({"process.env": { NODE_ENV: JSON.stringify(env) }}),
    // new BundleAnalyzerPlugin()
  ]
}

// 代码混淆压缩
if(env === 'production') {
  webpackConfig.plugins.push(new UglifyJSPlugin());
}

// 编译 html，多页面多入口
Object.keys(webpackConfig.entry).forEach(name => {
  if(name === 'common') return;
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    template: `./src/template.ejs`,
    filename: `${pathConfig.htmlBase}/${name}.html`,
    chunks: ['common', name],
    title: pkg.title[name],
    assetPath: pathConfig.assetPath
  }));
});

// clean
if(!process.argv[1].includes('webpack-dev-server')) {
  webpackConfig.plugins.push(new CleanWebpackPlugin([pathConfig.cleanPath]));
}

module.exports = webpackConfig;
