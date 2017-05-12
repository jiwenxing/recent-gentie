var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
 
var app = express();
 
// bodyParser.urlencoded解析form表单提交的数据
app.use(bodyParser.urlencoded({extended: false}));
 
// bodyParser.json解析json数据格式的
app.use(bodyParser.json());
 
app.post('/saveJSON',function(req, res){

    // 对象转换为字符串
    var str_json = JSON.stringify(req.body);    
    str_json = str_json.substr(0,str_json.length-1).substr(1,str_json.length);

    // 获取用户名
    var user_name=req.query.user;

    var filePathName = 'data/'+user_name+'.json'

   fs.exists(filePathName, function(exists) {  
       // console.log(exists); 
       if (exists) {
            fs.appendFile(filePathName, ','+str_json, function (err) {
                 // console.log("追加文件成功");
            });
       }else{
            fs.writeFile(filePathName, str_json, 'utf8', function(){
                 // console.log("保存完成");
            });
       } 
   });

   res.end("ok");
 
});

app.get('/getJSON', function(req, res){
   // 获取用户名
    var user_name=req.query.user;
    console.log(user_name);
    var filePathName = 'data/'+user_name+'.json'

    fs.readFile(filePathName,'utf8',function (err, data) {
        if(err) console.log(err);
        var json_str = '['+data+']';
        try {
            json = JSON.parse(json_str);
            var comment_html = "";
            var length = json.length > 5 ? json.length : 5;
            for(var i=json.length-1; i>=length-5; i--){
               var article_title = json[i].title; 
               var article_url = json[i].url;
               var comment_time = json[i].comments[0].ctime;
               var comment_user = json[i].comments[0].user.nickname;
               var comment_content = json[i].comments[0].content;
               comment_html = comment_html+'<li class="ds-comment"><div class="ds-meta"><a rel="nofollow author" target="_blank" href="">'+comment_user+'</a><span class="ds-time">'+comment_time+'</span></div><div class="ds-thread-title">在 <a href="'+article_url+'#comments">'+article_title+'</a> 中评论</div><div class="ds-excerpt">'+comment_content+'</div></li>';
            }
            
            res.send({"status":"ok","content":comment_html});
         } catch (err) {
            json = null;
            res.send({"status":"error"});
         }

     });
  
});

 
app.listen(3001);