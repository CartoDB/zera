const express = require('express')
const app = express()
var cors = require('cors');

app.use(cors());
app.get('/*', function (req, res) {
    res.status(429).json({
        errors: [
            { message: 'Limit reached' }
        ]
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})