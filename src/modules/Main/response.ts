import IHTTPResponse from '../RPC/IHTTPResponse';

export class MainResponse implements IHTTPResponse {
  private _status:number;
  private _data?:any;
  constructor(status:number, data?:any) {
    this._status = status;
    this._data = data;
  }

  public get status():number {
    return this._status;
  }

  public get data():any {
    return this._data;
  }
}