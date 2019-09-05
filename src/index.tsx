import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

import './_sass/reset.scss';
// #########################
import Context, { ContextState, Userflag } from '_base/Context';
import Init from './x000/Init';
import Sign from './x000/Sign';
import Head from './x000/Head';
import Draw from './x000/Draw';
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
  <ConfigProvider locale={zh_CN}>
    <Context>{renderRouter}</Context>
  </ConfigProvider>,
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
          <Layout style={{ height: '100%' }}>
            <Route component={Head} />
            <Layout>
              <Layout.Sider
                width={200}
                theme="light"
                style={{ backgroundColor: 'white' }}>
                Menu
              </Layout.Sider>
              <Layout style={{ padding: '8px' }}>
                <Switch>
                  <Route path={Draw.path} component={Draw} />
                  <Redirect exact from="/" to="/x000/draw" />
                </Switch>
              </Layout>
            </Layout>
          </Layout>
        </Router>
      );
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
