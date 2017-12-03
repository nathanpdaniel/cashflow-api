"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _1 = require("./");
class MainRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    pending(req, res, next) {
        const mainCtrl = new _1.MainController();
        mainCtrl.pending().then((response) => {
            // data processing here
            res.sendStatus(204);
        }).catch((error) => {
            res.sendStatus(501);
        });
    }
    getAccountDetails(req, res, next) {
        const mainCtrl = new _1.MainController();
        mainCtrl.loadAccountBalance(req.params).then((response) => {
            const percent = Number(response) / 10000;
            res.json({ balance: response, threshold: 10000, percent });
        }).catch((error) => {
            res.sendStatus(501);
        });
    }
    chargeAccount(req, res, next) {
        const mainCtrl = new _1.MainController();
        mainCtrl.chargeAccount(req.params, req.body).then((response) => {
            res.json(response);
        }).catch((error) => {
            res.sendStatus(501);
        });
    }
    processPayments(req, res, next) {
        const mainCtrl = new _1.MainController();
        mainCtrl.processPayments().then((response) => {
            res.json(response);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(501);
        });
    }
    baseRequest(req, res, next) {
        res.sendStatus(200);
    }
    init() {
        this.router.get('/', this.baseRequest);
        this.router.get('/connect', this.pending);
        // account/815/DDA/00000000000000822943114
        this.router.get('/account/:companyId/:productCode/:primary', this.getAccountDetails); // usbank api get account balance details
        this.router.post('/charge/:merchantId/:userId/:pin', this.chargeAccount); // elavon api chart credit card!
        this.router.get('/customers', this.pending); // see list of customers
        this.router.post('/customers', this.pending); // add customer
        this.router.get('/suppliers', this.pending); // see list of suppliers
        this.router.post('/suppliers', this.pending); // add supplier
        // payments/process - send payements to suppliers
        // payments/cancel
        this.router.get('/payments/:action', this.processPayments); // action: process, cancel
        this.router.get('/merchant', this.pending);
    }
}
exports.MainRouter = MainRouter;
exports.default = MainRouter;
