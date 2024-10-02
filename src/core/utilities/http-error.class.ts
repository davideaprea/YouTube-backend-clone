export class HttpError extends Error {
    constructor(
        public readonly status: number,
        msg?: string
    ) {
        super(msg);
        
        if (msg) return;

        switch (status) {
            case 400:
                this.message = "Bad request.";
                break;
            
            case 401:
                this.message = "Missing authentication.";
                break;

            case 403:
                this.message = "Missing authorization.";
                break;
            
            case 404:
                this.message = "Resource not found.";
                break;
            
            case 500:
                this.message = "Internal server error.";
                break;
        }
    }
}