var nlp = require('compromise')
fs = require('fs');

module.exports=function check(req, res, next) {
var lines = fs.readFileSync('../abusive_words.txt', 'utf8').split('\n');
for (var l in lines)
{
    var line = lines[l];
    var sent=req.body.desc
    var length=nlp(sent).match('. _'+line+'_ .').out('array').length
    if(length>0)
    {
        
        return true
    }
         

}
return false

}
