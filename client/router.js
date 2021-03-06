'use strict';

/**
 * @typedef {Object} Route
 * @property {string} uri Address path to use for route
 * @property {Component | Function} destination Component or function to lazy load component
 * @property {boolean} lazy Specify if route is lazy loaded
 * @property {boolean} [defaultRoute]
 * @property {string} [redirectTo] If it's a default route specify a route path to redirect to
 * @property {Promise<boolean>} [authGuard]
 */

export class Router {
  constructor() {
    this.routes = [];
    this.routerOutlet = null;
    // Listen to browser nav events
    window.addEventListener('popstate', e => this.navigate(e.target.location.pathname, true));
  }

  /**
   * Creates a route
   * @param {Route} routeOptions
   */
  get(routeOptions) {
    // if(!routeOptions.uri || !routeOptions.component) throw new Error('uri or component must be given');

    if (typeof routeOptions.uri !== 'string') throw new TypeError('typeof uri must be a string');
    // if(!routeOptions.component instanceof Component) throw new TypeError('typeof component must be a Component');

    this.routes.forEach(route => {
      if (route.uri === routeOptions.uri) throw new Error(`the uri ${route.uri} already exists`);
    });

    this.routes.push(routeOptions);
  }

  init(routerOutlet) {
    this.routerOutlet = routerOutlet;
    this.navigate(window.location.pathname);
  }

  navigate(path, prevRoute) {
    this.routes.some(route => {
      this.matchRoute(route, path, prevRoute);
    });
  }

  matchRoute(route, path, prevRoute) {
    const regEx = new RegExp('^' + route.uri.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
    if (path.match(regEx)) {
      if (route.defaultRoute) {
        this.navigate(route.redirectTo);
      } else {
        const params = this.getParams(route, path);
        this.goToPage(route, path, params, prevRoute);
      }
      return true;
    } else {
      return false;
    }
  }

  async goToPage(route, path, params, prevRoute) {
    const req = { path, params };
    if (route.authGuard) {
      const auth = await route.authGuard();
      if (auth) {
        if (route.lazy) {
          const loadedComponent = await route.destination();
          this.routerOutlet.routeComponent(loadedComponent, req);
        } else {
          this.routerOutlet.routeComponent(route.domponent, req);
        }
        if (!prevRoute) history.pushState({}, '', path);
      } else {
        this.navigate('/login');
      }
    } else {
      if (route.lazy) {
        const loadedComponent = await route.destination();
        this.routerOutlet.routeComponent(loadedComponent, req);
      } else {
        this.routerOutlet.routeComponent(route.domponent, req);
      }
      if (!prevRoute) history.pushState({}, '', path);
    }
  }

  getParams(route, path) {
    // Get list of parameter names
    const paramNames = route.uri.split('/:');
    const routeName = paramNames.shift();

    // Remove route name to get paramater string
    const paramString = path.replace(routeName, '');
    // Split params using / and output into array

    const paramValues = paramString.split('/')
      // Remove empty params
      .filter(el => { return el.length !== 0; });

    // Create return object of params values with names
    const params = {};
    for (let i = 0; i < paramValues.length; i++) {
      params[paramNames[i]] = paramValues[i];
    }
    return params;
  }
}
