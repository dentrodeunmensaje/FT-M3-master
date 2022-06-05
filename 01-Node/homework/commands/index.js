
const fs = require('fs');

module.exports = {
    echo: function(args, print){
        print(args.join(" "));    
    },
    date: function(args, print){
        print(Date());
    },
    ls: function(args,print){
        
        fs.readdir('.', function(err, files){
            if (err) throw err;
            print(files.join('\n'));
        });
    },
    pwd: function(args, print){ 
        print(process.cwd());
    },
    cat: function(args, print){
        
        fs.readFile(args[0], 'utf8', function(err, data){
            if (err) throw err;
            print(data.toString());
        });
    },
    head: function(args, print){
        fs.readFile(args[0], 'utf8', function(err, data){
            if (err) throw err;
            print(data.toString().split('\n').slice(0,args[1]).join('\n'));
        });
    },
    tail: function(args, print){
        fs.readFile(args[0], 'utf8', function(err, data){
            if (err) throw err;
            print(data.toString().split('\n').slice(-args[1]).join('\n'));
        });
    },
    curl: function(args, print){
        const request = require('request');
        request(args[0], function(err, response, body){
            if (err) throw err;
            print(body);
        });
    }
}