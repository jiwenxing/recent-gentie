# recent-gentie
获取网易云跟帖最新跟帖内容，基于nodejs实现，部署在亚马逊AWS。

# 使用场景

由于多说即将停止服务，博客中使用网易云跟帖提供评论服务，但是发现我无法及时查看博客中的最新留言，查阅了官方文档也没有找到获取最新评论的接口，于是写了一个nodejs的服务放在我的aws主机上，并对外提供获取最新留言查询接口。

例如我的博客中有一个展示最新留言的widget如下：
![](http://7xry05.com1.z0.glb.clouddn.com/201705162024_165.png)

# 使用方法

1. 在[网易云跟帖后台管理](https://manage.gentie.163.com)中配置回推接口
在网易云跟帖->后台管理->获取代码->优化设置的回推接口中填入评论回推接口地址（见下方接口说明），注意将参数中username替换为自己的用户名，用户名自定。配置完成后站点上每产生一条跟贴，将会向这个地址推送一条跟贴数据。

2. 在博客或需要使用的地方调用获取评论接口查询最新留言
注意将接口中的username替换为第一步中使用的用户名，获取到留言数据后根据需要进行处理展示。调用方法示例如下：
```javascript
fetch("http://gentie.jverson.com/getComments?user=username").then(function(res) {
  if (res.ok) {
    res.json().then(function(data) {
      console.log(data.content);
      //do some thing
    });
  } else {
    console.log("Looks like the response wasn't perfect, got status", res.status);
  }
}, function(e) {
  console.log("Fetch failed!", e);
});
```

# 接口说明

提供以下三个接口：

### 评论回推接口
http://gentie.jverson.com/saveComments?user=username

### 获取最新评论数据接口（返回json数据）
http://gentie.jverson.com/getRawComments?user=username
返回数据格式如下：
```json
{
    "status":"ok",
    "content":[
        {
            "title":"云跟贴体验文章",
            "url":"http://rasca1xsss",
            "sourceId":"2",
            "ctime":1461333601000,
            "comments":[
                {
                    "cid":"2555053846",
                    "content":"来自云跟贴的测试数据",
                    "ctime":1471252987000,
                    "pid":"0",
                    "ip":"220.181.102.177",
                    "source":"web",
                    "anonymous":false,
                    "attachment":{
                        "type":0,
                        "desc":"",
                        "info":""
                    },
                    "user":{
                        "userId":"95738681",
                        "nickname":"网易云跟贴官方",
                        "avatar":"http://cms-bucket.nosdn.127.net/ec18d69788bb43aa866884633d212df720161220225628.jpg"
                    }
                }
            ]
        },
        {
            "title":"云跟贴体验文章",
            "url":"http://rasca1xsss",
            "sourceId":"2",
            "ctime":1461333601000,
            "comments":[
                {
                    "cid":"2555053846",
                    "content":"来自云跟贴的测试数据",
                    "ctime":1471252987000,
                    "pid":"0",
                    "ip":"220.181.102.177",
                    "source":"web",
                    "anonymous":false,
                    "attachment":{
                        "type":0,
                        "desc":"",
                        "info":""
                    },
                    "user":{
                        "userId":"95738681",
                        "nickname":"网易云跟贴官方",
                        "avatar":"http://cms-bucket.nosdn.127.net/ec18d69788bb43aa866884633d212df720161220225628.jpg"
                    }
                }
            ]
        }
    ]
}
```

### 获取最新评论（返回拼装好的html）
http://gentie.jverson.com/getComments?user=username
返回数据格式如下:
```json
{
    "status":"ok",
    "content":"<li class="ds-comment"><div class="ds-meta"><a rel="nofollow author" target="_blank" href="">网易云跟贴官方 </a><span class="ds-time">8月15日</span></div><div class="ds-thread-title">在 <a href="http://rasca1xsss#comments">云跟贴体验文章</a> 中评论</div><div class="ds-excerpt">来自云跟贴的测试数据</div></li><li class="ds-comment"><div class="ds-meta"><a rel="nofollow author" target="_blank" href="">网易云跟贴官方 </a><span class="ds-time">8月15日</span></div><div class="ds-thread-title">在 <a href="http://rasca1xsss#comments">云跟贴体验文章</a> 中评论</div><div class="ds-excerpt">来自云跟贴的测试数据</div></li>"
}
```
注：该接口只适合用于[maupassant主题](http://jverson.com/)