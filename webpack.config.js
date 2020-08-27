require('dotenv').config({ path: __dirname + '/.env' });
//.envの設定
const config = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VUE_APP_apiKey: JSON.stringify(process.env.VUE_APP_apiKey),
        VUE_APP_authDomain: JSON.stringify(process.env.VUE_APP_authDomain),
        VUE_APP_databaseURL: JSON.stringify(process.env.VUE_APP_databaseURL),
        VUE_APP_projectId: JSON.stringify(process.env.VUE_APP_projectId),
        VUE_APP_storageBucket: JSON.stringify(process.env.VUE_APP_storageBucket),
        VUE_APP_messagingSenderId: JSON.stringify(process.env.VUE_APP_messagingSenderId),
        VUE_APP_appId: JSON.stringify(process.env.VUE_APP_appId),
        VUE_APP_measurementId: JSON.stringify(process.env.VUE_APP_measurementId)
      }
    })
  ]
};