// vue.config.js
module.exports = {
  // options...
 	devServer: {
  		proxy: {
			'^/exchange': {
				target: 'https://api.coindcx.com',
				ws: false,
				changeOrigin: true,
			},
  		},
  		clientLogLevel: 'debug', // 'silent' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'none' | 'warning'	
	}
}