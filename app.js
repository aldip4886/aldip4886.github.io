const http = require('http')
const fs = require('fs')
const port = process.env.PORT || 53604;


// you will need to install via 'npm install jsonwebtoken' or in your package.json

// var jwt = require("jsonwebtoken");

// var METABASE_SITE_URL = "http://metabase4.herokuapp.com";
// var METABASE_SECRET_KEY = "f8b7e029026108a5af475da4925271fc23d8378cc996bf10d114765880a44565";

// var payload = {
//   resource: { question: 116 },
//   params: {},
//   exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
// };
// var token = jwt.sign(payload, METABASE_SECRET_KEY);

// var iframeUrl = METABASE_SITE_URL + "/embed/question/" + token + "#bordered=false&titled=false";


const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'texthtml'})
    fs.readFile('index.html', function(error, data) {
        if (error){
            res.writeHead(404)
            res.write('Error: File Not Found')
        } else{
            res.write(data)
        }
        res.end()
    })    
    
})

server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening ' + port)

    }
}) 