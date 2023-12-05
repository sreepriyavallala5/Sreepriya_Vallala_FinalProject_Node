const http = require('http');
const path = require('path');
const fs= require('fs');
const server = http.createServer((req, res)=>{
    if (req.url==='/api'){
        fs.readFile(
            path.join(__dirname, 'public', 'db.json'),'utf-8',
                    (err, content) => {
                                    
                                    if (err) throw err;
                                    // Please note the content-type here is application/json
                                    res.setHeader("Access-Control-Allow-Origin", '*')
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(content);
                        }
              );
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