import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import './_sass/reset.scss';
// #########################
import Context, { ContextState, Userflag } from '_base/Context';
import Init from './x000/Init';
import Sign from './x000/Sign';
import Head from './x000/Head';
// #########################
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Layout } from 'antd';
// #########################

import './_sass/cover.scss';

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <Context>{renderRouter}</Context>
  </LocaleProvider>,
  document.getElementById('root')
);

function renderRouter({ userflag, userName, popupView }: ContextState) {
  switch (userflag) {
    case Userflag.LOADING:
      return <Init />;
    case Userflag.UNKNOWN:
      return <Sign />;
    default:
      return (
        <Router>
          <Layout>
            <Route component={Head} />
            <Switch>
              <Redirect exact from="/" to="/x000" />
            </Switch>
          </Layout>
        </Router>
      );
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
