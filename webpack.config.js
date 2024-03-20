const path = require('path'); // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map', // Здесь задаем создание карт 🗺️
  entry: './src/index.js', // Точка входа для сборки проекта

  output: {
    filename: 'main.js', // Имя выходного файла сборки
    path: path.resolve(__dirname, 'dist'), // Путь для выходного файла сборки
  },

  module: {
    rules: [
      {
        test: /\.css$/, // Регулярное выражение для обработки файлов с расширением .css
        use: ['style-loader', 'css-loader'], // Загрузчики, используемые для обработки CSS-файлов
      },

      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { sourceMaps: true } // Командуем Babel создавать карты ⚒️
        }
      },      


    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Каталог для статики
    },
    //open: true // Автоматически открывать браузер
    open: {
      app: {
        name: "chrome",
        arguments: ["--incognito", "--remote-debugging-port=9222"],
      },
    }

  },

  mode: 'development', // Режим сборки
};