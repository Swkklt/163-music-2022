// 初始化对象 

// !function(){}() ES6之前的立即执行函数语法 // 为了防止暴露全局变量
// 下边是ES6的语法
{  // 为了防止暴露全局变量
    // console.log('AV-API')
    // console.log(AV)
    // leanCloud————Javascript JDK  通过npm安装后进行初始化
    AV.init({
        appId: "febKHLxDgtGpOLfy6JCqG46T-gzGzoHsz",
        appKey: "Rrf9V6pVlYipLPbrphUcb14m",
        serverURL: "https://febkhlxd.lc-cn-n1-shared.com"
    })
    
    // // 然后在项目中编写如下测试代码————创建数据库
    // const TestObject = AV.Object.extend('Playlist');
    // // 创建一条记录
    // const testObject = new TestObject();
    // // testObject.set('words', 'Hello world!');
    // // 保存记录真正创建数据库
    // testObject.save({
    //     name: 'test',
    //     cover: 'test',
    //     creatorId: 'test',
    //     description: 'test',
    //     songs:[]
    // }).then((testObject) => {
    //     alert('leanCloud Rocks!')
    //     // console.log('保存成功。')
    // },()=>{
    //     alert('创建失败')
    // }
    // )
    
}


