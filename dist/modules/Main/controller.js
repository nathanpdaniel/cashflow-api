"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
const service_2 = require("../Visa/service");
class MainController {
    pending() {
        // DB updates
        // 3rd party API calls
        // any external modifications...
        // Services implement RPC.IService interface
        // RPC.IService has 1 function `load(callSignature)` which returns a Promise<Response>
        var service = new service_1.MainService();
        return service.call('', {});
    }
    loadAccountBalance({ companyId, productCode, primary }) {
        var service = new service_1.MainService();
        const url = 'http://api119521live.gateway.akana.com/api/v1/account/details';
        const req = {
            method: 'POST',
            body: JSON.stringify({
                "OperatingCompanyIdentifier": companyId || '815',
                "ProductCode": productCode || 'DDA',
                "PrimaryIdentifier": primary || "00000000000000822943114"
            })
        };
        return service.call(url, req)
            .then(r => r.json())
            .then(r => r.BasicAccountDetail.Balances.CurrentBalanceAmount);
    }
    chargeAccount({ merchantId, userId, pin }, { transactionType, cardNumber, expDate, amount, firstName }) {
        var service = new service_1.MainService();
        const url = 'https://api.demo.convergepay.com/VirtualMerchantDemo/processxml.do';
        const q = `<txn>
        <ssl_merchant_id>${merchantId}</ssl_merchant_id>
        <ssl_user_id>${userId}</ssl_user_id>
        <ssl_pin>${pin}</ssl_pin>
        <ssl_transaction_type>${transactionType}</ssl_transaction_type>
        <ssl_card_number>${cardNumber}</ssl_card_number>
        <ssl_exp_date>${expDate}</ssl_exp_date>
        <ssl_amount>${amount}</ssl_amount>
        <ssl_first_name>${firstName}</ssl_first_name>
      </txn>`;
        return service.call(`${url}?xmldata=${q}`);
    }
    processPayments() {
        var visa = new service_2.VisaService();
        var strDate = new Date().toISOString().replace(/Z/, '');
        var searchRequest = JSON.stringify({
            "header": {
                "messageDateTime": strDate,
                "requestMessageId": "CDISI_GMR_001",
                "startIndex": "1"
            },
            "searchAttrList": {
                "visaMerchantId": "11687107",
                "visaStoreId": "125861096",
                "merchantName": "ALOHA CAFE",
                "merchantCountryCode": "840",
                "merchantCity": "LOS ANGELES",
                "merchantState": "CA",
                "merchantPostalCode": "90012",
                "merchantStreetAddress": "410 E 2ND ST",
                "businessRegistrationId": "196007747",
                "acquirerCardAcceptorId": "191642760469222",
                "acquiringBin": "486168"
            },
            "responseAttrList": ["GNSTANDARD"],
            "searchOptions": {
                "maxRecords": "2",
                "matchIndicators": "true",
                "matchScore": "true"
            }
        });
        var baseUri = 'merchantsearch/';
        var resourcePath = 'v1/search';
        const p = new Promise((resolve, reject) => {
            visa.doMutualAuthRequest(baseUri + resourcePath, searchRequest, 'POST', {}, (err, response, body) => {
                if (err) {
                    reject(err);
                }
                resolve(body);
            });
        });
        return p;
    }
}
exports.MainController = MainController;
exports.default = MainController;
