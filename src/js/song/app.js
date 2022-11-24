{
    let view = {
        el: '#app',
        render(data){
            let {song,status} = data
            $(this.el).css('background-image',`url(${song.cover})`)
            $(this.el).find('img.cover').attr('src',song.cover)
            if($(this.el).find('audio').attr('src') !== song.url){
                $(this.el).find('audio').attr('src',song.url)
            }
            if(status === 'playing'){
                $(this.el).find('.disc-container').addClass('playing')
            }else{
                $(this.el).find('.disc-container').removeClass('playing')
            }
        },
        // template: `
        // <audio autoplay controls src={{url}}></audio>
        // `,//html 下边的+player()
        // template: `
        //     <audio src={{url}}></audio>
        //     <div>
        //         <button class="play">播放</button>
        //         <button class="pause">暂停</button>
        //     </div>
        // `,
        // init() {
        //     this.$el = $(this.el)
        // },
        // render(data) {
        //     this.$el.html(this.template.replace('{{url}}',data.url))
        // },
        play(){
            $(this.el).find('audio')[0].play()
            // let  audio = this.$el.find('audio')[0]
            // audio.play()
        },
        pause(){
            $(this.el).find('audio')[0].pause()
            // let  audio = this.$el.find('audio')[0]
            // audio.pause()
        }
    }
    let model = {
        data: {
            song:{
                id: '',
                name: '',
                singer: '',
                url: ''
            },
            status:'paused'
            
        },
        get(id) {
            // leancloud源代码
            // const query = new AV.Query('Todo');
            // query.get('582570f38ac247004f39c24b').then((todo) => {
            //     // todo 就是 objectId 为 582570f38ac247004f39c24b 的 Todo 实例
            //     const title = todo.get('title');
            //     const priority = todo.get('priority');

            //     // 获取内置属性
            //     const objectId = todo.id;
            //     const updatedAt = todo.updatedAt;
            //     const createdAt = todo.createdAt;
            // });
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{  // 不能用function，否则会变成this会变成window
                // console.log(song)
                Object.assign(this.data.song,{id: song.id,...song.attributes})
                return song
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            // console.log(id)
            this.model.get(id).then(()=>{
                console.log(this.model.data)
                this.view.render(this.model.data)
                // this.view.play()
                // setTimeout(()=>{  // 好像浏览器不允许开发者控制播放
                //     this.view.play()
                // },3000)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.icon-play',()=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click','.icon-pause',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            // $(this.view.el).on('click','.icon-wrapper',()=>{
            //     this.view.pause()
            // })
        },
        getSongId() {
            let search = window.location.search
            // console.log(search)
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            console.log(search)
            let array = search.split('&').filter((v => v))  // 通过加filter可以过滤空字符串
            console.log(array)

            let id = ''
            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                }
                break
            }
            return id
        }
    }
    controller.init(view, model)
}

