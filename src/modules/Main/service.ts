import fetch from 'node-fetch';
import RPC from '../RPC';

export class MainService implements RPC.IService {
  call(url?:string, callSignature?:any):Promise<Response> {
    // make external API calls using something like this
    return fetch(url, callSignature);
  }
}

export default MainService;