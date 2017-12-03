"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MainResponse {
    constructor(status, data) {
        this._status = status;
        this._data = data;
    }
    get status() {
        return this._status;
    }
    get data() {
        return this._data;
    }
}
exports.MainResponse = MainResponse;
