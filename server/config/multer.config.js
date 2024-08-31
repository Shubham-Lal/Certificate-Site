const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        cb(new Error('Invalid file type. Only PDF file is allowed'), false)
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
})

module.exports = upload