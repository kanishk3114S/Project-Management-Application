import multer from "multer"

// diskStorage tells Multer:
// "Store the uploaded file on my server's disk"


const storage = multer.diskStorage({

    // WHERE should the uploaded file be stored?
    destination: function(req, file, cb) {

        // cb(error, destination)
        // null = no error
        // "./public/images" = folder where file will be saved

        cb(null, "./public/images")
    },

    // WHAT should the uploaded file be called?
    filename: function(req, file, cb) {

        // file.originalname = original name sent by the user
        // Date.now() = current timestamp
        //
        // Example:
        // originalname = "photo.jpg"
        // saved name   = "1726412345678-photo.jpg"
        //
        // This helps avoid filename collisions.

        cb(null, `${Date.now()}-${file.originalname}`)
    }
})


// Create the Multer middleware using our storage configuration.
export const upload = multer({

    // Use the storage configuration defined above.
    storage,

    // File upload restrictions
    limits: {

        // Maximum size of ONE uploaded file = 1 MB
        // 1 * 1000 * 1000 = 1,000,000 bytes ≈ 1 MB

        fileSize: 1 * 1000 * 1000
    }
})