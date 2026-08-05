class ApiResponse {

    // This class creates a standard success response
    // so every API sends data in the same format.

    constructor(statusCode, data, message = "success") {

        this.statusCode = statusCode;   // HTTP Status Code (200, 201, etc.)
        this.data = data;               // Actual data we want to send
        this.message = message;         // Custom success message

        // If status code is below 400,
        // then the request is considered successful.
        this.success = statusCode < 400;
    }

}

export { ApiResponse };

