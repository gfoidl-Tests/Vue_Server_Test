const CssMinimizerPlugin         = require("css-minimizer-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { GitRevisionPlugin }      = require("git-revision-webpack-plugin");
const HtmlWebpackPlugin          = require("html-webpack-plugin");
const MiniCssExtractPlugin       = require("mini-css-extract-plugin");
const path                       = require("path");
const PreloadWebpackPlugin       = require("@vue/preload-webpack-plugin");
const svgToMiniDataUri           = require("mini-svg-data-uri");
const TerserPlugin               = require("terser-webpack-plugin");
const TsconfigPathsPlugin        = require("tsconfig-paths-webpack-plugin");
const { VueLoaderPlugin }        = require("vue-loader");
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
            path    : path.resolve(__dirname, "..", "backend", "source", "Server", "wwwroot"),
            filename: devMode ? "[name].js" : "[name].[contenthash:8].js",
            clean   : true,
            assetModuleFilename: devMode ? "images/[name][ext][query]" : "images/[name].[hash][ext][query]"    // for asset modules name
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
                            loader : MiniCssExtractPlugin.loader,
                            options: {
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
                    test: /\.(png|jpg|jpeg|gif)$/i,
                    // type: "asset/resource"
                    type: "asset"                       // automatically chooses between exporting a data URI and emitting a separate file
                },
                {
                    test     : /\.svg/i,
                    type     : "asset/inline",
                    generator: {
                        dataUrl: content => {
                            content = content.toString();
                            return svgToMiniDataUri(content);
                        }
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
                __RUN_FROM_TEST__: false,

                // For vue's esm-bundler
                __VUE_OPTIONS_API__  : false,
                __VUE_PROD_DEVTOOLS__: false
            }),
            new VueLoaderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                async     : true,
                typescript: {
                    configFile : tsConfigFile,
                    memoryLimit: 4096,
                    extensions: {
                        vue: {
                            enabled : true,
                            compiler: "vue/compiler-sfc"
                        }
                    }
                },
            }),
            new MiniCssExtractPlugin({
                filename     : devMode ? "[name].css" : "[name].[contenthash:8].css",
                chunkFilename: devMode ? "[id].css"   : "[id].[contenthash:8].css"
            }),
            new HtmlWebpackPlugin({
                template: "../index.html"
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
            moduleIds   : devMode ? "named" : "deterministic",
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
                    "core-ui": {
                        test  : /[\\/]node_modules[\\/](@coreui|bootstrap|popper)/,
                        name  : "core-ui",
                        chunks: "all"
                    }
                }
            },
            minimizer: [
                new TerserPlugin({}),
                new CssMinimizerPlugin()
            ]
        },
        devtool  : devMode ? "cheap-source-map" : "source-map", // eval variants execute the code as eval(code), so not readable in the output
        devServer: {
            historyApiFallback: true,
            port  : 8080,
            hot   : "only",
            static: false,
            client: {
                overlay: {
                    errors  : true,
                    warnings: false,
                },
                // progress: true                       // Too much noise in console logs of browser
            },
            // proxy doesn't work with Windows-Auth
            // Below is the "short-form"
            //proxy: {
            //    "/api": {
            //        target: "https://localhost:44369",
            //        secure: false                       // for HTTPS with self-signed certificate
            //    }
            //}
            proxy: {
                context: ["/api", "/health", "/hubs"],
                target : "https://localhost:44369",
                secure : false,                         // for HTTPS with self-signed certificate
                ws     : true                           // for SignalR / Websockets
            }
        }
    };

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
