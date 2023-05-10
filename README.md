

# Operato Windrose Grafana Panel <img src="./src/img/operato-windrose-logo.svg" width=32>

## How to build the plugin?

If you want to build the plugin to install it manually you can run the command:

``` bash 
yarn build
```

Since Grafana requires all plugins to be signed (unles you are running Grafana in development mode or you specify to load unsigned plugins) you will need to sign the plugin before you will be able to install it. Here is a short `bash` script to sign the plugin. You will need to input your Grafana API key and the URL address your grafana is running on (you can also input multiple adresses):

``` bash
export GRAFANA_API_KEY={YOUR-GRAFANA-API-KEY}
npx @grafana/sign-plugin@latest --rootUrls http://localhost:3000,https://example.com/,http://grafana.yourdomain.com:3000/
```

After you have build and signed the plugin you only need to copy the `dist` folder to the plugins folder of your Grafana instalation.
