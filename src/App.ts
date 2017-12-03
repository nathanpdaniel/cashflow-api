import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { MainRouter } from './modules/Main';

class App {
  public express:express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware():void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes():void {
    var main:MainRouter = new MainRouter();
    // var app:AppRouter = new AppRouter();

    this.express.use('/', main.router);
    // this.express.use('/app', app.router);
  }
}

export default new App().express;