## 文件结构

public/

    index.html 入口

    loading_entry.html loading页、场馆外页面、全景页合并, 入口页面

    ball_demo.html 场馆外demo

    ball_test.html 场馆外测试页面

    loading_demo.html loading页demo

    stage_demo.html 全景demo页面

    stage_test.html 全景测试页面

    css css文件

    demo 无用

    dev_tools 开发用工具，无用

    dist js文件打包输出目录

    images 图片目录

         ball 场馆外陀螺仪素材

         dialog 全景弹窗素材

         loading loading素材

         rain 首页素材

         stage 全景页面素材

            drops 雨滴素材

            skybox 全景图素材

    js   js资源文件，主要测试用

    lib  js库文件

    media 多媒体文件

src  ES6文件夹

    main.js 入口文件

    ...其他文件见引用详情

### 环境变量
    
 1. 存放位置: /env

    dev.js 为开发环境，prod.js为正式环境
    
 2. 变量说明
    
    NODE_ENV : 环境
    
    BAIDU_MAP_URL : 外链地址
    
    CDN_PREFIX : cdn地址,末尾不要带/符号
            
### 编译源文件


 ```bash
 #安装环境
 npm install

 #开发环境,监听文件变化
 npm run start

 #生产环境,压缩文件
 npm run deploy

 ```

###入口文件

#### html模板
    html/index.html
    
### 部署注意
    静态资源在编写代码的过程中，全部以相对根路径（即 public 目录）方式引用。
    
        
 









