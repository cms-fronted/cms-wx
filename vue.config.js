const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

module.exports = {
  publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : "./", // 默认'/'，部署应用包时的基本 URL
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1,
  pwa: {},
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://canteen.tonglingok.com',
        ws: true,
        changeOrigin: true
      },
    }
  },
  configureWebpack: config => {
    if (IS_PROD) {
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            elementUI: {
              name: 'chunk-elementUI',
              priority: 20,
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: 'all'
            }
          }
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .tap(options => {
        // 修改它的选项...
        options.fallback.options.name = 'img/[name].[ext]?' //去除图片hash
        options.limit = 1024; //这是字节(Byte)限制，1KB = 1024Byte ,当图片的大小小于 1KB ,则会被转为 base64格式，打包进js文件，大于1KB,则会被打包进 img 文件夹，供链接请求获取。 
        return options
    });
    if (IS_PROD) {
      config.optimization.delete('splitChunks')
    }
    return config
  }
};
