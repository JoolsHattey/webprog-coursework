export class Router {

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
        const regEx = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));

        console.log(this.routes);

        console.log(path);
        console.log(route);

        if(path.match(regEx)) {
            const params = this.getParams(path);
            this.goToPage(route, path, params);
            return true;
        } else {
            return false;
        }
    }

    goToPage(route, path, params) {
        this.clearScreen();
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
        console.log(path)
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

    clearScreen() {
        if(document.querySelector("screen-elmnt")) {
            if(document.querySelector("screen-elmnt").shadowRoot.querySelector("quiz-screen")) {
                document.querySelector("screen-elmnt").shadowRoot.querySelector("quiz-screen").remove()
            }
            if(document.querySelector("screen-elmnt").shadowRoot.querySelector("home-screen")) {
                document.querySelector("screen-elmnt").shadowRoot.querySelector("home-screen").remove()
            }
            if(document.querySelector("screen-elmnt").shadowRoot.querySelector("admin-screen")) {
                document.querySelector("screen-elmnt").shadowRoot.querySelector("admin-screen").remove()
            }
        }
    }
}