export class ErrorMessage {
    constructor(msg: string, param: string, value: any) {
      this.param = param;
      this.msg = msg;
      this.value = value;
    }
    msg: string;
    param: string;
    value: any;
    location: string;
    nestedErrors: Array<ErrorMessage>;
  }
  export class ErrorArray {
    constructor() {
      this.errors = new Array<ErrorMessage>();
    }
    errors: Array<ErrorMessage>;
  }