class Router {

    constructor(){
       this.routes = [];
    }

    get(uri, callback){
        if(!uri || !callback) throw new Error('uri or callback must be given');

        if(typeof uri !== "string") throw new TypeError('typeof uri must be a string');
        if(typeof callback !== "function") throw new TypeError('typeof callback must be a function');

        this.routes.forEach(route=>{
            if(route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
        });

        const route = {
            uri,
            callback
        }
        this.routes.push(route);
    }

    goToPage(route) {      

        const regEx2 = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));

        const regEx1 = new RegExp("^" + route.uri.replace(/:[^\s/]+/g, '([\\w-]+)') + "$")

        const path = window.location.pathname;

        if(path.match(regEx1)) {

            console.log("hmmm")

            const params = this.getParams(path);

            console.log(params)

            let req;

            if(params) {
                const param1 = params[0];
                const param2 = params[1];
                req = { path, param1, param2 }
                console.log(req)
            } else {
                req = { path }
            }

            

            
        
            return route.callback.call(this, req);

        } else if(path.match(regEx2)) {

            const params = this.getParams(path);

            console.log(params)

            let req;

            if(params) {
                const param1 = params[0];
                const param2 = params[1];
                req = { path, param1, param2 }
                console.log(req)
            } else {
                req = { path }
            }

            //let req = { path }
            return route.callback.call(this, req);
        }
    }

    init(){
        this.routes.some(route=>{
            this.goToPage(route);
        });
    }

    navigate(path) {
        this.routes.some(route=>{

            history.pushState({}, "", path)

            this.goToPage(route);
        });
    }

    getParams(path) {

        console.log("hello??")

        const numParams = path.split("/").length - 1

        const url = path.split( '/' );

        console.log(numParams)

        if(numParams === 2) {
            return [( url[ url.length - 1 ] )];
        } else if(numParams === 3) {
            return [( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
        } else if(numParams === 4) {
            return [( url[ url.length - 3 ] ), ( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
        }
    }
}