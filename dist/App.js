"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const Main_1 = require("./modules/Main");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    routes() {
        var main = new Main_1.MainRouter();
        // var app:AppRouter = new AppRouter();
        this.express.use('/', main.router);
        // this.express.use('/app', app.router);
    }
}
exports.default = new App().express;
