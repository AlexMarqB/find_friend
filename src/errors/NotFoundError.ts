
export class ResourceNotFoundError extends Error {
    constructor(message?: string) {
        if(message) {
            super(message);
            return;
        }
        super()
    }
}