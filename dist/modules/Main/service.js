"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class MainService {
    call(url, callSignature) {
        // make external API calls using something like this
        return node_fetch_1.default(url, callSignature);
    }
}
exports.MainService = MainService;
exports.default = MainService;
