The documentation is published at [Github Pages](https://ngolin.github.io/reactant-template/)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Reproduce

[Create React App](https://facebook.github.io/create-react-app/docs/adding-typescript)

```bash
$ yarn create react-app reactant-template --typescript
```

[Add `antd`](https://ant.design/docs/react/use-in-typescript-cn)

```bash
$ yarn add antd
$ yarn add react-app-rewired customize-cra
$ yarn add babel-plugin-import
$ yarn add less less-loader
```

Edit `package.json`

```
"scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test"
-   "eject": "react-scripts eject"
}
```

Add `react-router-dom`

```bash
$ yarn add react-router-dom @types/react-router-dom
```

Edit `package.json`

```
+ "homepage": "https://pro.ngolin.com/",
```

## Trouble Shooting

Ubuntu `System limit for number of file watchers reached`

```bash
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

git default editor

```bash
$ export EDITOR=vim
```
