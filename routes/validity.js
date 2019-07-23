const express = require("express");
const router = express.Router();
const auth=require("../middleware/auth");
var nlp = require('compromise')
fs = require('fs');
const path = require('path')

router.post('/check',async(req,res)=>{
    var lines = fs.readFileSync('./abusive_words.txt', 'utf8').split('\n');
    for (var l in lines)
    {
        var line = lines[l];
        var sent=req.body.desc
        var length= nlp(sent).match('_'+line+'_').out('array').length
        if(length>0)
        {
            
            return res.send({message:true})
             
        }
             
    
    }
    
    return res.send({message:false})
})
    




module.exports=router;