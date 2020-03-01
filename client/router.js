class Router {

    constructor(){
       this.routes = [];
    }

    get(uri, callback, authGuard){
        if(!uri || !callback) throw new Error('uri or callback must be given');

        if(typeof uri !== "string") throw new TypeError('typeof uri must be a string');
        if(typeof callback !== "function") throw new TypeError('typeof callback must be a function');

        this.routes.forEach(route=>{
            if(route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
        });

        const route = {
            uri,
            callback,
            authGuard
        }
        this.routes.push(route);
    }

    matchRoute(route, path) {
        const regEx2 = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));

        const regEx1 = new RegExp("^" + route.uri.replace(/:[^\s/]+/g, '([\\w-]+)') + "$")

        if(path.match(regEx1)) {
            const params = this.getParams(path);
            this.goToPage(route, path, params);
        } else if(path.match(regEx2)) {
            const params = this.getParams(path);
            this.goToPage(route, path, params);
        }
    }

    goToPage(route, path, params) {
        let req;
        if(params) {
            const param1 = params[0];
            const param2 = params[1];
            req = { path, param1, param2 };
        } else {
            req = { path };
        }

        if(route.authGuard) {
            if(route.authGuard.call()) {
                history.pushState({}, "", path)
                return route.callback.call(this, req);
            } else {
                console.log("Auth error");
            }
        } else {
            history.pushState({}, "", path)
            return route.callback.call(this, req);
        }
    }

    init(){
        this.routes.some(route=>{
            const path = window.location.pathname;
            this.matchRoute(route, path);
        });
    }

    navigate(path) {
        this.routes.some(route=>{
            this.matchRoute(route, path);
        });
    }

    getParams(path) {

        console.log(path)

        const numParams = path.split("/").length - 1

        const url = path.split( '/' );

        if(numParams === 2) {
            return [( url[ url.length - 1 ] )];
        } else if(numParams === 3) {
            return [( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
        } else if(numParams === 4) {
            return [( url[ url.length - 3 ] ), ( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
        }
    }
}