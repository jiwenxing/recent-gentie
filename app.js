var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
 
var app = express();
 
// bodyParser.urlencoded解析form表单提交的数据
app.use(bodyParser.urlencoded({extended: false}));
 
// bodyParser.json解析json数据格式的
app.use(bodyParser.json());


/**
  网易云跟帖回推接口
  每次有新评论，网易会将评论数据回推至此接口
  接口中会对最新评论数据按照用户名称分文件进行保存
*/
app.post('/saveComments',function(req, res){

    // 对象转换为字符串
    var str_json = JSON.stringify(req.body.data);
    
    // 将对象数组最外层的引号及方括号删掉
    str_json = str_json.substr(0,str_json.length-2).substr(2,str_json.length);

    // 获取用户名
    var user_name=req.query.user;

    var filePathName = 'data/'+user_name+'.json'

   fs.exists(filePathName, function(exists) {  
       if (exists) {
            // 文件中将评论对象以逗号分隔存储，取回时两边添加方括号即为对象数组
            fs.appendFile(filePathName, ','+str_json, function (err) {
                 // console.log("追加文件");
            });
       }else{
            fs.writeFile(filePathName, str_json, 'utf8', function(){
                 // console.log("新增文件");
            });
       } 
   });

   res.end("ok");
 
});


/**
  获取最新跟帖接口（返回html）
  按照用户名返回最新评论数据，该接口已将数据拼装为html直接返回，可直接使用于Maupassant主题的展示
*/
app.get('/getComments', function(req, res){
   
    var user_name=req.query.user;
    var filePathName = 'data/'+user_name+'.json'

    fs.readFile(filePathName,'utf8',function (err, data) {
        if(err) console.log(err);
        var json_str = '['+data+']';
        try {
            json_str = json_str.replace(/\\/g,"");
            json = JSON.parse(json_str);
            var comment_html = "";
            var length = json.length > 5 ? json.length : 5;
            for(var i=json.length-1; i>=length-5; i--){
               var article_title = json[i].title; 
               var article_url = json[i].url;
               var comments = json[i].comments;
               var comment_time = comments[0].ctime;
               var now = new Date(comment_time);
               var month=now.getMonth()+1; 
               var date=now.getDate();
               comment_time = month+"月"+date+"日";
               var comment_user = comments[0].user.nickname;
               var comment_content = comments[0].content;
               comment_html = comment_html+'<li class="ds-comment"><div class="ds-meta"><a rel="nofollow author" target="_blank" href="">'+comment_user+' </a><span class="ds-time">'+comment_time+'</span></div><div class="ds-thread-title">在 <a href="'+article_url+'#comments">'+article_title+'</a> 中评论</div><div class="ds-excerpt">'+comment_content+'</div></li>';
            }
            
            res.header('Access-Control-Allow-Origin', '*');
            res.send({"status":"ok","content":comment_html});
         } catch (err) {
            json = null;
            res.send({"status":"error"});
         }

     });
  
});


/**
  获取最新跟帖接口（json格式）
  按照用户名返回最新评论的json格式数据，便于用户自定义展示样式
*/
app.get('/getRawComments', function(req, res){
   
    var user_name=req.query.user;
    var filePathName = 'data/'+user_name+'.json'

    fs.readFile(filePathName,'utf8',function (err, data) {
        if(err) console.log(err);
        var json_str = '['+data+']';
        try {
            json_str = json_str.replace(/\\/g,"");
            json = JSON.parse(json_str);
            res.header('Access-Control-Allow-Origin', '*');
            res.send({"status":"ok","content":json});
         } catch (err) {
            json = null;
            res.send({"status":"error"});
         }

     });
  
});

 
app.listen(3001);