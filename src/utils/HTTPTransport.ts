import { queryStringify } from "./queryStringify";

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

type Options = {
  method: Method;
  data?: any;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

export default class HTTPTransport {
  get(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    const query = options.data ? queryStringify(options.data) : '';
    return this.request(url + query, { ...options, method: Method.GET, data: query});
  }

  request(url: string, options: Options = { method: Method.GET }, timeout = 5000): Promise<XMLHttpRequest> {
    const { method, data } = options;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url);
      xhr.timeout = timeout;
      xhr.onload = function () {
        resolve(xhr);
      };


      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === Method.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    })
  }
}