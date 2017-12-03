import { Router, Request, Response, NextFunction } from 'express';
import RPC from '../RPC';
import IHTTPResponse from '../RPC/IHTTPResponse';
import { MainController } from './';

export class MainRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public pending(req:Request, res:Response, next:NextFunction) {
    const mainCtrl = new MainController();
    
    mainCtrl.pending().then((response:any) => {
      // data processing here
      res.sendStatus(204);
    }).catch((error:any) => {
      res.sendStatus(501);
    });
    
  }

  public getAccountDetails(req:Request, res:Response, next:NextFunction) {
    const mainCtrl = new MainController();

    mainCtrl.loadAccountBalance(req.params).then((response:any) => {
      const percent = Number(response) / 10000;
      res.json({ balance: response, threshold: 10000, percent });
    }).catch((error:any) => {
      res.sendStatus(501);
    });
  }

  public chargeAccount(req:Request, res:Response, next:NextFunction) {
    const mainCtrl = new MainController();

    mainCtrl.chargeAccount(req.params, req.body).then((response:any) => {
      res.json(response);
    }).catch((error:any) => {
      res.sendStatus(501);
    });
  }

  public processPayments(req:Request, res:Response, next:NextFunction) {
    const mainCtrl = new MainController();

    mainCtrl.processPayments().then((response:any) => {
      res.json(response);
    }).catch((error:any) => {
      console.log(error);
      res.sendStatus(501);
    });
  }

  public getSuppliers(req:Request, res:Response, next:NextFunction) {
    res.json([{
      name: 'Balloons R Us',
      visa: true,
      address: {
        street: '123 A St',
        city: 'Atlanta',
        state: 'GA',
        zip: '30363'
      }
    }, {
      name: 'Flower Supply',
      visa: true,
      address: {
        street: '2 Hydrangea Ave',
        city: 'Atlanta',
        state: 'GA',
        zip: '30308'
      }
    }, {
      name: 'All the Plants',
      visa: false,
      address: {
        street: 'Garden Street',
        city: 'Atlanta',
        state: 'GA',
        zip: '30307'
      }
    }])
  }

  public addSupplier(req:Request, res:Response, next:NextFunction) {
    const mainCtrl = new MainController();

    mainCtrl.addSupplier({}).then((response:any) => {
      res.json(response);
    }).catch((error:any) => {
      console.log(error);
      res.sendStatus(500);
    });
  }

  public getCustomers(req:Request, res:Response, next:NextFunction) {
    res.json([{
      name: 'Garden Alley',
      visa: true,
      address: {
        street: '123 A St',
        city: 'Atlanta',
        state: 'GA',
        zip: '30363'
      }
    }, {
      name: 'Botanical Gardens',
      visa: true,
      address: {
        street: 'Piedmont Ave',
        city: 'Atlanta',
        state: 'GA',
        zip: '30308'
      }
    }]);
  }

  public baseRequest(req:Request, res:Response, next:NextFunction) {
    res.sendStatus(200);
  }


  init() {
    this.router.get('/', this.baseRequest);
    this.router.get('/connect', this.pending);
    // account/815/DDA/00000000000000822943114
    this.router.get('/account/:companyId/:productCode/:primary', this.getAccountDetails); // usbank api get account balance details
    this.router.post('/charge/:merchantId/:userId/:pin', this.chargeAccount); // elavon api chart credit card!
    this.router.get('/customers', this.getCustomers); // see list of customers
    this.router.post('/customers', this.pending); // add customer
    this.router.get('/suppliers', this.getSuppliers); // see list of suppliers
    this.router.post('/suppliers', this.addSupplier); // add supplier
    // payments/process - send payements to suppliers
    // payments/cancel
    this.router.get('/payments/:action', this.processPayments); // action: process, cancel
    this.router.get('/merchant', this.pending);
  }
}

export default MainRouter;