const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const envify = require('./env/envify');
const env = require('./env/prod');
const theme = {
	'@cdn': env.CDN_PREFIX
};
module.exports = {
	entry: [
		//'webpack-dev-server/client?http://localhost:10086',
		__dirname + '/src/main.js'
	],
	output: {
		filename: 'dist/bundle[hash:8].js',
		chunkFilename: '[name].[chunkhash:5].chunk.js',
        path: __dirname + '/public/',
        publicPath: '/',
	},
	devtool: 'source-map',
	// devtool: 'eval',
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: ['babel-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?import=false&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader'
			},
			{
				test: /\.less$/,
				//use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: `css-loader!less-loader?{"modifyVars":${JSON.stringify(theme)}}` }),
				//loader: `style-loader!css-loader?url=false!less-loader?{"modifyVars":${JSON.stringify(theme)}}`,
				use: [{
					loader: "style-loader"
				},{
					loader: "css-loader",
					options: {
						url: false
					}
				},{
					loader: "less-loader",
					options: {
						globalVars: {
							cdn: '"'+env.CDN_PREFIX+'"'
						}
					}
				}]
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			}
		]
	},
	// externals: {
	//   'react': 'React',
	//   'react-dom': 'ReactDOM',
	//   'react-redux': 'ReactRedux',
	//   'react-router': 'ReactRouter',
	//   'react-router-dom': 'ReactRouterDOM',
	//   'react-router-redux': 'ReactRouterRedux',
	//   'redux': 'Redux',
	//   'redux-saga': 'ReduxSaga',
	// },
	plugins: [
		new webpack.DefinePlugin({
			'process.env': envify(env)
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
			template: './html/index.html',
        })
	],
	externals: {
		// require("jquery") is external and available
		//  on the global var jQuery
		'$': 'jQuery',
		'_': '_',
	},
	devServer: {
		port: 10086,
		host: '0.0.0.0',
		hot: true,
		inline: true,
		historyApiFallback: {
			index: 'html/main.html'
		}
	}
};