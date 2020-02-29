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

    init(){
        this.routes.some(route=>{

            let regEx2 = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));

            let regEx1 = new RegExp("^" + route.uri.replace(/:[^\s/]+/g, '([\\w-]+)') + "$")

            let path = window.location.pathname;

            if(path.match(regEx1)) {

                const params = this.getParams(path);

                const param1 = params[0];
                const param2 = params[1];

                let req = { path, param1, param2 }
            
                return route.callback.call(this, req);

            } else if(path.match(regEx2)) {

                let req = { path }
                return route.callback.call(this, req);
            }
        });
    }

    getParams(path) {

        const numParams = path.split("/").length - 1

        var url = path.split( '/' );

        if(numParams === 2) {
            console.log([( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )])
            return [( url[ url.length - 1 ] )];
        } else if(numParams === 3) {
            return [( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
        }       
    }
}