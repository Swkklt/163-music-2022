// !function(){}() ES6之前的立即执行函数语法
// 下边是ES6的语法
{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class="form">
                <div class="row">
                    <label>
                        歌名
                    </label>
                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label>
                        歌手
                    </label>
                    <input name="singer" type="text" value="__singer__">
                </div>
                <div class="row">
                    <label>
                        外链
                    </label>
                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row">
                    <label>
                        封面
                    </label>
                    <input name="cover" type="text" value="__cover__">
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>
            </form>        
        `,
        render(data = {}) {  // ES6语法：如果用户没有传data或者传的data是一个undefined，就设置其为空
            let placeholdders = ['name', 'url','singer','id','cover']
            let html = this.template
            placeholdders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset(){
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: '',cover:''
        },
        update(data){
            var song = AV.Object.createWithoutData('Song',this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            return song.save()
            .then((response)=>{ // 因为leanCloud响应里边没有最新的数据所以这里要写.then
                Object.assign(this.data,data)
                return response
            })
        },
        create(data) {
            // // swkklt:初始代码
            // // 声明 class
            // const Todo = AV.Object.extend('Todo');

            // // 构建对象
            // const todo = new Todo();

            // // 为属性赋值
            // todo.set('title', '马拉松报名');
            // todo.set('priority', 2);
            
            // // 将对象保存到云端
            // todo.save().then((todo) => {
            //     // 成功保存之后，执行其他逻辑
            //     console.log(`保存成功。objectId：${todo.id}`);
            // }, (error) => {
            //     // 异常处理
            // });
            console.log('songform.js将歌曲存到数据库leanCloud')
            // 声明 class
            var Song = AV.Object.extend('Song');
            // 构建对象
            var song = new Song();
            // 为属性赋值————设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            // 将对象保存到云端
            return song.save().then((newSong)=>{
                // 成功保存之后，执行其他逻辑
                // console.log(`保存成功。objectId：${todo.id}`);
                
                // console.log(newSong)
                let {id,attributes} = newSong
                // this.data = {id, ...attributes}

                // let this.data.id = id
                // let this.data.name = attributes.name
                // let this.data.singer = attributes.singer
                // let this.data.url = attributes.url
                // 上边四行等价于下边的一段
                Object.assign( // 将后者赋值给前者
                    this.data,
                    // {
                    //     id : id,
                    //     name: attributes.name,
                    //     singer: attributes.singer,
                    //     url: attributes.url
                    // }
                    //  // 上段等价于下段————下段应用了ES6语法
                    {id,...attributes,}
                ) 
            }, (error) => {
                // 保存异常处理
                console.log('error')
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                // if(data === undefined){
                //     this.model.data = {
                //         name:'',url:'',id:'',singer:''
                //     }
                // }else{
                //     this.model.data = data
                // }
                // 上边的一段可以简化成下边的两行
                // data = data || { name:'',url:'',id:'',singer:''}
                // this.model.data = data
                if(this.model.data.id){
                    this.model.data = { name:'',url:'',id:'',singer:''}
                }else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs = 'name singer url cover'.split(' ')// 通过空格得到一个数组 等价于let need = ['name','singer','url'] 
            let data = {}
            // foreach就是一个没有返回值的map，所以最好用map
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(()=>{  // 未懂：此处下方如果要写一些语句，this.model.create(data)必须要有返回值return
                    this.view.reset() 
                    // console.log(this.model.data)
                    // 下边两行是一种深拷贝的方式,避免因为其它地方引用同一块内存地址的内容出现bug
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create',object)  
                    // window.eventHub.emit('create',this.model.data)  
                })
            // console.log(data)
        },
        update(){
            let needs = 'name singer url cover'.split(' ')// 通过空格得到一个数组 等价于let need = ['name','singer','url'] 
            let data = {}
            // foreach就是一个没有返回值的map，所以最好用map
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)  // 将编辑数据更新到leancloud数据库
                .then(()=>{
                    // alert('leancloud数据编辑更新成功了')
                    window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))  // this.model.data有问题
                })
            
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()  // 阻止页面的默认刷新
                console.log('点击了按钮')
                if(this.model.data.id){
                    this.update()
                }else{
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
    // window.app.songForm = controller
}