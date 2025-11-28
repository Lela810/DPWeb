export class HttpError extends Error {
    code;
    msg;
    get message() {
        return this.msg;
    }
    get status() {
        return this.code;
    }
    constructor(code, msg) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }
}