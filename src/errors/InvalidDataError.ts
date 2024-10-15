
export class InvalidDataError extends Error {
    constructor(message?: string) {
        if(message) {
            super(message);
            return;
        }
        super()
    }
}