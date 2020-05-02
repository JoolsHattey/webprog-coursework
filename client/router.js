"use strict";
import { Component } from "./components/component.js";

export class Router {

    constructor() {
       this.routes = [];
       this.routerOutlet = null;
    }

    get(uri, component, authGuard) {
        if(!uri || !component) throw new Error('uri or component must be given');

        if(typeof uri !== "string") throw new TypeError('typeof uri must be a string');
        if(!component instanceof Component) throw new TypeError('typeof component must be a Component');

        this.routes.forEach(route=>{
            if(route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
        });

        const route = {
            uri,
            component,
            authGuard
        }
        this.routes.push(route);
    }

    init(routerOutlet) {
        this.routerOutlet = routerOutlet;
        this.navigate(window.location.pathname);
    }

    navigate(path) {
        this.routes.some(route => {
            this.matchRoute(route, path);
        });
    }

    matchRoute(route, path) {
        const regEx = new RegExp("^" + route.uri.replace(/:[^\s/]+/g, '([\\w-]+)') + "$");
        if(path.match(regEx)) {
            const params = this.getParams(route, path);
            this.goToPage(route, path, params);
            return true;
        } else {
            return false;
        }
    }

    goToPage(route, path, params) {
        const req = { path, params };
        if(route.authGuard) {
            if(params[route.authGuard.ifParams.param] === route.authGuard.ifParams.value) {
                if(route.authGuard.getAuthStatus()) {
                    // Set address bar to router path
                    history.pushState({}, "", path)
                    this.routerOutlet.routeComponent(route.component, req);
                } else {
                    console.log("Not Authenticated")
                }
            } else {
                // Set address bar to router path
                history.pushState({}, "", path);
                this.routerOutlet.routeComponent(route.component, req);
            }
        } else {
            // Set address bar to router path
            history.pushState({}, "", path)
            this.routerOutlet.routeComponent(route.component, req);            
        }
    }

    getParams(route, path) {
        // Get list of parameter names
        const paramNames = route.uri.split('/:')
        const routeName = paramNames.shift();

        // Remove route name to get paramater string
        const paramString = path.replace(routeName, '');
        // Split params using / and output into array

        const paramValues = paramString.split('/')
            // Remove empty params
            .filter(el => {return el.length != 0});
        
        // Create return object of params values with names
        let params = {};
        for(let i=0; i<paramValues.length; i++) {
            params[paramNames[i]] = paramValues[i];
        }
        return params;
    }
}