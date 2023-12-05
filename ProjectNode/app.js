const http = require('http');
const path = require('path');
const fs= require('fs');
const mongo_client = require('mongodb').MongoClient;
const mongoDbConnection = require('./connectDb.js');

const { error } = require('console');
const mongoURI = 'mongodb+srv://priya_vuenode:priya@123@cluster0.stm9eqz.mongodb.net/';

const mongoClientConnection = new mongo_client(mongoURI);


const server = http.createServer((req, res)=>{
    if (req.url==='/'){
        fs.readFile(
            path.join(__dirname, 'public/index.html'),'utf-8',
                    (err, content) => {
                                    
                        if (error) {
                            console.error(error);
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.end('Internal Server Error');
                          } else {
                              res.writeHead(200, {'Content-Type': 'text/html'});
                              res.end(data);
                          }
                        });
    }else if(req.url == '/api'){
        const headers = {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
                            "Content-Type": 'application/json'
                       };
                       (async(req,res)=>{
                        try{
                            await mongoClientConnection.connect();
                            const db = mongoClientConnection.db(mongoDbConnection.db);
                            const collection = db.collection(mongoDbConnection.collection);
                            if(req.method === 'GET'){
                                var docJson = await collection.find({}).toArray();
                                docJson = JSON.stringify(docJson, null, 2);
                                fs.writeFile('./public/db.json', docJson, () => {});
                                res.writeHead(200, headers);
                                res.end(docJson);
                                console.log(docJson);

                            }
                            else{
                                res.writeHead(405, {'Content-Type': 'text/plain'});
                                res.end('Method not supported');
                            }
                        }catch(err){
                            console.error(err);
                        }
                       })(req,res);
    }

    else{
    let filePath= path.join(__dirname, 'public', req.url==='/' ? 'index.html':req.url );
    let extname = path.extname(filePath)
    switch(extname){
        case '.css':
            contentType= 'text/css';
            break;
        case '.js':
            contentType= 'text/javascript';
            break;
        case '.json':
            contentType= 'application/json';
            break;
        case '.html':
                contentType= 'text/html';
                break
        
    }
    fs.readFile(filePath, (err, content)=>{
            if(err) {
                        if(err.code = 'ENONET'){ // file dont exist 
                            // display the 404 page here
                            fs.readFile(path.join(__dirname,'public','404.html'),(err,content)=>{
                                res.setHeader("Access-Control-Allow-Origin", '*')
                                res.writeHead(200, {"Content-Type": 'text/html'});
                                res.end(content, 'utf-8')
                            });
                                    
                        }
                        else{
                            res.writeHead(500);
                            res.end(`server error ${err.code}` );
                        }
            }else{
                res.setHeader("Access-Control-Allow-Origin", '*')
                res.writeHead(200, {'Content-Type':contentType})
                res.end(content, 'utf-8')
            }
    });
}
});
const PORT = process.env.PORT || 3300;
server.listen(PORT,()=>console.log(`Server is running successfully and the port number is ${PORT}`))