import React, { FunctionComponent } from 'react';
import { RouteComponentProps, Redirect, Switch, Route } from 'react-router-dom';

type Params = {
  [key: string]: string;
};

type PathOf<T extends Params> = {
  pathOf(params?: Partial<Record<keyof T, string | number>>): string;
  path: string;
};

type Mix<T, A> = (Component: T) => T & A;

export default function withPath<T extends Params, Q extends Params>(
  path: string,
  defaultParams: T = {} as T,
  defaultQuery: Q = {} as Q
): Mix<FunctionComponent<RouteComponentProps<T>>, PathOf<T & Q>> {
  return Component => {
    const pathOf = getPathOf(path, defaultParams, defaultQuery);
    let withRouteComponent = Component as any;
    if (Object.keys(defaultParams).length) {
      withRouteComponent = (props: RouteComponentProps<T>) => (
        <Switch>
          <Route
            path={pathOf(keyParams(defaultParams) as any).split('?')[0]}
            // component={Component}
            render={_props =>
              React.createElement(Component, { ...props, ..._props })
            }
          />
          <Redirect to={pathOf({ ...defaultParams, ...defaultQuery } as any)} />
        </Switch>
      );
    }
    withRouteComponent.displayName = `withPath(${path})`;
    withRouteComponent.pathOf = pathOf;
    withRouteComponent.path = path;
    return withRouteComponent;
  };
}

function getPathOf<T extends Params, Q extends Params>(
  path: string,
  defaultParams: T,
  defaultQuery: Q
): PathOf<T & Q>['pathOf'] {
  const pkeys = Object.keys(defaultParams);
  const qkeys = Object.keys(defaultQuery);
  if (pkeys.length && qkeys.length) {
    return params => {
      const _params = { ...defaultParams, ...defaultQuery, ...params };
      return `${path}/${pkeys
        .map(key => encodeURIComponent(_params[key]))
        .join('/')}?${qkeys
        .map(key => `${key}=${encodeURIComponent(_params[key])}`)
        .join('&')}`;
    };
  }
  if (pkeys.length) {
    return params => {
      const _params = { ...defaultParams, params };
      return `${path}/${pkeys
        .map(key => encodeURIComponent(_params[key]))
        .join('/')}`;
    };
  }
  if (qkeys.length) {
    return params => {
      const _params = { ...defaultQuery, ...params };
      return `${path}?${qkeys
        .map(key => `${key}=${encodeURIComponent(_params[key])}`)
        .join('&')}`;
    };
  }
  return () => path;
}

function keyParams<T extends Params>(params: T): T {
  return Object.keys(params).reduce(
    (o, k) => (((o as any)[k] = `:${k}`), o),
    {} as T
  );
}
