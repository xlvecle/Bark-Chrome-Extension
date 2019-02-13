# Bark-Chrome-Extension

---

#### 更新日志:

##### 20190103:

+ 可以直接将剪贴板内容push到手机，提供了可配置的选项

+ 添加了多设备支持

---


Bark是什么?

```
https://github.com/Finb/Bark/
Bark is an iOS App which allows you to push customed notifications to your iPhone.

作者原贴：
https://www.v2ex.com/t/467407
App 源码 
https://github.com/Finb/Bark 
后端源码 
https://github.com/Finb/go-tools/blob/master/Bark.go
```

这是一款chrome插件能帮你方便地把**网页上的文本或者网址**推送到Bark手机端。

安装说明：

+ 请直接前往Chrome应用商店安装: https://chrome.google.com/webstore/detail/bark/pmlkbdbpglkgbgopghdcmohdcmladeii

+ ~~下载release目录中的src.crx，https://github.com/xlvecle/Bark-Chrome-Extension/raw/master/release/src.crx~~ 

+ ~~打开chrome插件管理页面，拖进去安装即可~~

使用说明：

+ 直接点击Bark图标可以push当前网页的网址

+ 选中文本后(需要等待DOM Ready)点击Bark图标可以push选中文本

+ 选中文本后可以通过右键菜单push文本到iPhone

+ 右键Bark图标可以进入配置页配置服务器

友情提示:

+ 请提前在Bark手机端注册自己的设备，在配置页配置专属自己的push url，形如 http://xxx.xxx/YourKey/

+ 支持自己搭建的服务器

