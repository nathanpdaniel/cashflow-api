import request from 'request';
import { readFileSync } from 'fs';
import { createHmac } from 'crypto';
import fetch from 'node-fetch';

const config = {
  "userId": "0UVH0E9AEUN28N7BE85W21dbYd8B3p_bqPMN8atJwpbXAIqsY",
  "password": "6B722URJGxACcZRd5TztZP8362hBwOD28",
  "key": "/src/modules/Visa/security/key.pem",
  "cert": "/src/modules/Visa/security/cert.pem",
  "visaUrl": "https://sandbox.api.visa.com/",
  "sharedSecret": ""
};

const KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAtWts+uc5Y997s8dmQbkhphX0Garm9fSf6w6k+GEX808PDPYs
qyPtGNkjQUGoPwVSXc04eXrn80RkdmAaGySzWSYcQWF42HxYX+1PMY6iszNXy57I
zRhtKFCDVp2lbN7nm8L0VlUKo4RXSeKRL8DFHTlmEI0LlMZ/breGgaqNpbagfIXW
cADL+dNVG0/Y2rXqAw35Eek5dYNrRwM1UPW7H9Rc07HPMzbaync9xLXxEa4rMpYx
O2U3dT11zoYT9PQaEtnkjlkch70f+8IO8FAJtwdg9zLBxUTUzwcXaR8eqDM9LXb1
6p3YNTmxvKn5uMHNzjXKo4T4+jkALFcHz8IHkwIDAQABAoIBAQCPCdwrFxQQwqvt
21GskCMPqE+FzVG8qttLoYhArY0MsVDUj2Q4q2LNLKa3VOUqiy+d9aiJX3ZyP4JW
Mv9iV1Vw/LNaeVemmKO1Po4qLKPrVpfqW49G5fNqzdBAApvjcvx5uwSa7QIuWrHX
92Mxm3POzurCMfLnonnm+Zx7r9VuyXHip/V5f7Lk6Vlz17znqokdXdEzfnToLqld
e+I6SvYCyQQgar0a0CsY+Oqc9qT+F2JGDKe9YfKKPv2xiYmNVWifYs7nrL0IJO2R
MPqmuEKWpf8S5PblcyNyg+/fCyClf/mARqVDxqd1k6CfY2t2sbBrCVmSq913oCy0
CEmU6eNBAoGBAO1mApNsZUqf+Pgm5HhkaJ+/HONCQStFVSP0XMSCpF6zYKnC8n+N
gVCnNrLeXudBgRklg2lNngA4ggzUR5NBKh2TNg9C+n09J0847AbweiJRjVXZqtz5
ys0j61XEC/LAG/ILmS+BzbNupG4qKnjNEGd04xhQFHyVDRBGez/uTxq1AoGBAMOi
iF+98ZwKuKRj592NSvKiPN+p7Q6rqiEODmdXoEWlGDppGTb3kXFcRDX5KQNKJlSw
iCZoXBVyoKgxLnmdARasXtZ4nULg/Sd9rkxe3W2QosyRSJafl1DEKRn5wlupyERa
gOI4ju297WuWmZvSdbbnFlmQaP6JufdUDsNB3N4nAoGBAJ5rkpB6p2WTN3uxyIkm
yELCMC7fyclsbRKfQUDJxZKEtZ7TvyurbH47996JUl+UcOgtBnLBHw0aqH6TMmhr
9gTidhLdKXdl1dOiMq+2zmoUbfK6XLE16EXZEHSdbTPDS2LMpp7zSifRT91MOid/
ANFpSRqyZdl1RdB0mE7jYtp5AoGACJyuDjDpYuoh6LKxMVKX+whjT6FGWz/5VE0v
GyODXa1/3Ipl3sKVN31NT2bxhECOYWoIBFDRxOvv4JeRqS7dLmdWIXDb02beHg/t
TVVbwAf+8qxumprZ6WdJO+h/wtM9iqzFQbAlspeKzRKrHm3sWqnflP/Db3kWo6mi
oLvUgj8CgYBawZ5d3pbrs9g2aQW4eSDkA19nsX6QCR5m7MBUQYrPkE/zvscD3o8k
5uDsdQI1bTKRl4qNDsXdh3Oy/FaWV+xjjmgh+IUazh8nJ2XwGIlp8qTD+t9TOmAg
XERF5tvIVRE4/oh1z4ba9OXos1YRbFAdJX5rG01CRnIMRN8w7MRybg==
-----END RSA PRIVATE KEY-----`;

const CERT = `-----BEGIN CERTIFICATE-----
MIIEGjCCAwKgAwIBAgIII+rmJEEnPBkwDQYJKoZIhvcNAQELBQAwMTEOMAwGA1UEAwwFVkRQQ0Ex
EjAQBgNVBAoMCVZEUFZJU0FDQTELMAkGA1UEBhMCVVMwHhcNMTcxMjAzMDIzOTE3WhcNMTkxMjAz
MDIzOTE3WjCB5zEoMCYGCSqGSIb3DQEJARYZbmF0aGFucGRhbmllbDAxQGdtYWlsLmNvbTE0MDIG
CgmSJomT8ixkAQEMJDliNDUzMzM2LTIzNmItNGU5OC04YjI4LTM4ZjU3YzViOWFiYzEtMCsGA1UE
AwwkOWI0NTMzMzYtMjM2Yi00ZTk4LThiMjgtMzhmNTdjNWI5YWJjMRMwEQYDVQQLDApEZXBhcnRt
ZW50MRUwEwYDVQQKDAxPcmdhbml6YXRpb24xDTALBgNVBAcMBENpdHkxDjAMBgNVBAgMBVN0YXRl
MQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALVrbPrnOWPfe7PH
ZkG5IaYV9Bmq5vX0n+sOpPhhF/NPDwz2LKsj7RjZI0FBqD8FUl3NOHl65/NEZHZgGhsks1kmHEFh
eNh8WF/tTzGOorMzV8ueyM0YbShQg1adpWze55vC9FZVCqOEV0nikS/AxR05ZhCNC5TGf263hoGq
jaW2oHyF1nAAy/nTVRtP2Nq16gMN+RHpOXWDa0cDNVD1ux/UXNOxzzM22sp3PcS18RGuKzKWMTtl
N3U9dc6GE/T0GhLZ5I5ZHIe9H/vCDvBQCbcHYPcywcVE1M8HF2kfHqgzPS129eqd2DU5sbyp+bjB
zc41yqOE+Po5ACxXB8/CB5MCAwEAAaN/MH0wHQYDVR0OBBYEFCPFfv48Rcp5q2XauWplTBfrQj3u
MAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUr91utqBLnHm5Fghi5iMxEKeC66EwDgYDVR0PAQH/
BAQDAgXgMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDANBgkqhkiG9w0BAQsFAAOCAQEA
lS0irKDyq0kwj+lWvCVut3yOz7QWVA/d7+KYQP/HsG2Z2iRfqEIoUc21zy5hmjb8+/PSPR9G1oyB
Eo4TyrTQjB6zi2Fb2/nFYOuYFNnekyhuDznCD0MSXYeeQP1i4ST+c0GTE/jsJIzFjMoyI+BTtOHF
qlryg00jKhAl3L8I6zqoFQEkZSDNNg7BX0ejLiR+tGTcyYhcSLhgp+5s/07wWKa5xHI24tbQCBta
WLDS8tsqTfoghf94LqpOZv/EfjWCeB4MXnnJSqVTRVDN3YSCCYTbrr64a+Gf61nUiOJD6U0ugJ0T
J0uR1JBiBhA4TipmLWfyoyHd9rmzy4+/YJ7vCQ==
-----END CERTIFICATE-----`;

export class VisaService {
  public doMutualAuthRequest(path, requestBody, methodType, headers, callback):any {
    var userId = config.userId ;
    var password = config.password;
    var keyFile = __dirname + '/security/key.pem'; //config.key;
    var certificateFile = __dirname + '/security/cert.pem'; //config.cert;
    
    if (methodType === 'POST' || methodType === 'PUT') {
      headers['Content-Type'] = 'application/json';
    }
  
    headers['Accept'] = 'application/json';
    headers['Authorization'] = this.getBasicAuthHeader(userId, password);
    headers['ex-correlation-id'] = '2kdfnafklf_SC';

    fetch(config.visaUrl + path, { method: methodType, headers: headers, body: requestBody, key: KEY, cert: CERT })
    .then(r => r.json())
    .then((response) => {
      console.log('response: ', response);
      callback(null, response);
    }).catch(e => callback(e));
    // request({
    //   uri : config.visaUrl + path,
    //   key: KEY,
    //   method : methodType,
    //   cert: CERT,
    //   headers: headers,
    //   body: requestBody,
    //   timeout: 30000
    // }, function(error, response, body) {
    //   if (!error) {
    //     callback(null, response, body);
    //   } else {
    //     console.log(error);
    //     callback(error);
    //   }
    // });
  }

  public doXPayRequest(baseUri, resourcePath, queryParams, requestBody, methodType, headers, callback) {
    if (methodType === 'POST' || methodType === 'PUT') {
      headers['Content-Type'] = 'application/json';
    }
    
    headers['Accept'] = 'application/json';
    headers['x-pay-token'] = this.getXPayToken(resourcePath, queryParams, requestBody);
    headers['ex-correlation-id'] = '2kdfnafklfb_SC';
    fetch(config.visaUrl + baseUri + resourcePath + '?' + queryParams, { method: methodType, headers: headers, body: requestBody })
    .then(r => r.json())
    .then((response) => {
      callback(null, response);
    }).catch(e => callback(e));
  };

  private getBasicAuthHeader(userId, password) {
    return 'Basic ' + new Buffer(userId + ':' + password).toString('base64');
  }
  private getXPayToken(resourcePath:any, queryParams:any, postBody:any):any {
    var timestamp = Math.floor(Date.now() / 1000);
    var sharedSecret = config.sharedSecret;
    var preHashString = timestamp + resourcePath + queryParams + postBody;
    var hashString = createHmac('SHA256', sharedSecret).update(preHashString).digest('hex');
    var preHashString2 = resourcePath + queryParams + postBody;
    var hashString2 = createHmac('SHA256', sharedSecret).update(preHashString2).digest('hex');
    var xPayToken = 'xv2:' + timestamp + ':' + hashString;
    return xPayToken;	
  }
}
export default VisaService;