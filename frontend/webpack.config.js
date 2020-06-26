const { CleanWebpackPlugin }     = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const GitRevisionPlugin          = require("git-revision-webpack-plugin");
const HtmlWebpackPlugin          = require("html-webpack-plugin");
const MiniCssExtractPlugin       = require("mini-css-extract-plugin");
const OptimizeCssPlugin          = require("optimize-css-assets-webpack-plugin");
const path                       = require("path");
const PreloadWebpackPlugin       = require("preload-webpack-plugin");
const svgToMiniDataUri           = require("mini-svg-data-uri");
const TerserPlugin               = require("terser-webpack-plugin");
const TsconfigPathsPlugin        = require("tsconfig-paths-webpack-plugin");
const VueLoaderPlugin            = require("vue-loader/lib/plugin");
const Webpack                    = require("webpack");

// https://github.com/webpack-contrib/webpack-bundle-analyzer
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");
//-----------------------------------------------------------------------------
module.exports = (env, argv) => {
    const devMode = process.env !== "PRODUCTION" && argv.mode !== "production";

    if (devMode) {
        console.log("Development mode");
    } else {
        console.log("Production mode");
    }

    const tsConfigFile      = path.resolve(__dirname, "src", "ts", "tsconfig.json");
    const gitRevisionPlugin = new GitRevisionPlugin();

    const imgBaseOptions = {
        esModule  : false,                              // https://github.com/vuejs/vue-loader/issues/1612
        limit     : 8192,                               // bytes
        name      : devMode ? "[name].[ext]" : "[name].[hash:8].[ext]",
        outputPath: "images"
    };

    const config = {
        mode   : devMode ? "development" : "production",
        context: path.resolve(__dirname, "src", "ts"),  // resolve vs. join -> https://stackoverflow.com/a/39836259/347870
        entry  : {
            app: "./app"
        },
        resolve: {
            extensions: [".ts", ".vue", ".js"],         // when 'resolve' is not specified, in entry the extension has to be given
            // TsconfigPathsPlugin is used to automate this
            //alias: {
                //"@"   : path.resolve(__dirname, "src", "ts"),
                //"@svc": path.resolve(__dirname, "src", "ts", "services"),

                // Note: alias not needed when vue is in 'externals', as long the name matches
                // Note2: runtime only can be used when there are no template-strings used -- see app.ts for more info
                //vue$  : "vue/dist/vue.esm.js"         // https://forum.vuejs.org/t/vue-2-0-warn-you-are-using-the-runtime-only-build-of-vue-where-the-template-compiler-is-not-available/9429/3
            //},
            plugins: [new TsconfigPathsPlugin({ configFile: tsConfigFile })]
        },
        output: {
            path      : path.resolve(__dirname, "..", "backend", "source", "Server", "wwwroot", "assets"),
            // Don't make it relative to root (i.e. no leading /), so that it can be hosted everywhere (e.g. GH-pages)
            // Trailing / is mandatory, as the strings are just concatenated instead of handled properly :-(
            publicPath: "assets/",
            filename  : devMode ? "[name].js" : "[name].[contenthash:8].js"
        },
        module: {
            rules: [
                {
                    // If there is only one loader no use: [...] is needed
                    test   : /\.ts$/,
                    loader : "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        transpileOnly       : true,     // ForkTsCheckerWebpackPlugin is used for compilation errors
                        experimentalWatchApi: true,
                        appendTsSuffixTo    : [/\.vue$/]
                    }
                },
                {
                    test   : /\.vue$/,
                    loader : "vue-loader",
                    options: {
                        // https://bootstrap-vue.org/docs/reference/images
                        transformAssetUrls: {
                            video             : ["src", "poster"],
                            source            : "src",
                            img               : "src",
                            image             : "xlink:href",
                            "b-avatar"        : "src",
                            "b-img"           : "src",
                            "b-img-lazy"      : ["src", "blank-src"],
                            "b-card"          : "img-src",
                            "b-card-img"      : "src",
                            "b-card-img-lazy" : ["src", "blank-src"],
                            "b-carousel-slide": "img-src",
                            "b-embed"         : "src"
                        }
                    }
                },
                // below is for assets -> https://webpack.js.org/guides/asset-management/
                {
                    // Several loaders apply, they are processed from the end of the array
                    test: /\.(le|c)ss$/,
                    use : [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                esModule  : true,       // enables e.g. tree-shaking
                                hmr       : devMode,
                                publicPath: "./"        // CSS-path are relative to the CSS-file location
                            }
                        },
                        "css-loader",
                        {
                            loader : "less-loader",
                            options: {
                                lessOptions: {
                                    strictMath: true    // needed for Bootstrap: https://github.com/twbs/bootstrap/issues/28419
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    loader : "url-loader",
                    options: imgBaseOptions
                },
                {
                    test   : /\.svg$/i,
                    loader : "url-loader",
                    options: {
                        ...imgBaseOptions,
                        generator: content => svgToMiniDataUri(content.toString())
                    }
                }
            ]
        },
        plugins: [
            //gitRevisionPlugin,                        // uncomment to write VERSION and COMMITHASH files to output
            new Webpack.DefinePlugin({
                __DEBUG__        : JSON.stringify(devMode),
                __VERSION__      : JSON.stringify(gitRevisionPlugin.version()),
                __BASE_URL__     : JSON.stringify("/"), // for use with proxy, otherwise use line below
                //__BASE_URL__     : JSON.stringify(devMode ? "https://localhost:44369/" : "/"),
                __RUN_FROM_TEST__: false
            }),
            new Webpack.HashedModuleIdsPlugin(),
            new VueLoaderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                async     : false,
                typescript: {
                    configFile : tsConfigFile,
                    memoryLimit: 4096,
                    extensions: {
                        vue: true
                    }
                },
            }),
            new MiniCssExtractPlugin({
                filename     : devMode ? "[name].css" : "[name].[contenthash:8].css",
                chunkFilename: devMode ? "[id].css"   : "[id].[contenthash:8].css"
            }),
            new HtmlWebpackPlugin({
                template: "../index.html",
                filename: path.resolve(__dirname, "..", "backend", "source", "Server", "wwwroot", "index.html"),
            }),
            new PreloadWebpackPlugin({
                rel          : "preload",
                include      : "allAssets",
                fileWhitelist: [
                    /loading.*gif/,
                    /main.*.js$/
                ],
                as(entry) {
                    if (/\.gif$/.test(entry)) return "image";
                    return "script";
                }
            })
        ],
        optimization: {
            runtimeChunk: "single",
            splitChunks : {                             // https://webpack.js.org/plugins/split-chunks-plugin/
                chunks     : "all",                     // initial -> needed at entry instantly
                cacheGroups: {                          // async   -> async imports
                    app: {                              // all     -> all ;-)
                        name     : "app-common",
                        chunks   : "all",
                        minChunks: 2
                    },
                    common: {
                        test   : /[\\/]node_modules[\\/]/,
                        name   : "common",
                        chunks : "initial",             // with all everything will be included in index.html, so just the minimum to start
                        maxSize: !devMode ? 500000 : undefined  // dev-server doesn't like it
                    },
                    "async-common": {
                        test    : /[\\/]node_modules[\\/]/,
                        name    : "async-common",
                        chunks  : "async",              // with all everything will be included in index.html, so just the minimum to start
                        maxSize : !devMode ? 500000 : undefined, // dev-server doesn't like it
                        priority: -10
                    },
                    bootstrap: {
                        test  : /[\\/]node_modules[\\/](bootstrap|popper)/,
                        name  : "bootstrap",
                        chunks: "all"
                    }
                }
            },
            minimizer: [
                new TerserPlugin({}),
                new OptimizeCssPlugin({})
            ]
        },
        devtool  : "cheap-source-map",                  // https://webpack.js.org/configuration/devtool/
        devServer: {
            contentBase       : path.resolve(__dirname, "..", "backend", "source", "Server", "wwwroot"),
            watchContentBase  : true,
            historyApiFallback: true,
            // proxy doesn't work with Windows-Auth
            // Below is the "short-form"
            //proxy             : {
            //    "/api": {
            //        target: "https://localhost:44369",
            //        secure: false                       // for HTTPS with self-signed certificate
            //    }
            //}
            proxy: [{
                context: ["/api", "/health", "/hubs"],
                target : "https://localhost:44369",
                secure : false,                         // for HTTPS with self-signed certificate
                ws     : true                           // for SignalR / Websockets
            }]
        },
        // Hack for "Can't resolve 'fs'" (from winston), cf. https://webpack.js.org/configuration/node/ and https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
        node: {
            fs: "empty"
        }
    };

    // Inject CleanWebpackPlugin when not using dev-server. With the dev-server
    // there is a deadlock anywhere :-(
    const runsInDevServer = /webpack-dev-server.js$/.test(argv.$0);
    if (!runsInDevServer) {
        config.plugins.unshift(new CleanWebpackPlugin());
        console.log("added CleanWebpackPlugin");
    }

    if (process.env.ANALYZE) {
        const analyzer = new BundleAnalyzerPlugin.BundleAnalyzerPlugin();
        config.plugins.push(analyzer);
        console.log("added BundleAnalyzerPlugin");
    }

    return config;
};
//-----------------------------------------------------------------------------
// Configuration could be done with TypeScript too
// https://webpack.js.org/configuration/configuration-languages/
// Here I'll use JavaScript, as I didn't know / think about using TS therefore.
// Also almost all config-documentation and examples are bases on JS, so I'll
// stick to JS here.
