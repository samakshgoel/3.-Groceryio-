const multer = require('multer')
const fs = require('fs')



var storage = multer.diskStorage({
    destination: 'assets/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ '.jpg')
    }
})

var upload = multer({ storage: storage })
module.exports = upload;