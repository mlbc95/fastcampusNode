export class ErrorMessage {
    constructor(message: string, parameter: string, value: any) {
      this.parameter = parameter;
      this.message = message;
      this.value = value;
    }
    message: string;
    parameter: string;
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