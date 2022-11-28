{
    let view = {
        el: '#app',
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { song, status } = data
            this.$el.css('background-image', `url(${song.cover})`)
            this.$el.find('img.cover').attr('src', song.cover)
            if (this.$el.find('audio').attr('src') !== song.url) {
                let audio = this.$el.find('audio').attr('src', song.url).get(0)  // 事件会一件一件执行，并获得最终的第0个audio
                audio.onended = () => {  // 将audio的自己原型上的事件写成一个函数
                    window.eventHub.emit('songEnd')
                }
                audio.ontimeupdate = () => {  // 播放时间改变时执行对应的函数
                    console.log(audio.currentTime)
                    this.showlyric(audio.currentTime)  // audio.currentTime————当前歌曲播放流动时间更新一点就执行一次this.showlyric()函数
                }
            }
            if (status === 'playing') {
                this.$el.find('.disc-container').addClass('playing')
            } else {
                this.$el.find('.disc-container').removeClass('playing')
            }
            this.$el.find('.song-description>h1').text(song.name)
            let { lyrics } = song
            lyrics.split('\n').map((string) => {
                // console.log(string)
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                // console.log(matches)
                if (matches) {
                    p.textContent = matches[2]
                    // 下边几行将分钟变成秒
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let seconds = parts[1]
                    let newTime = parseInt(minutes, 10) * 60 + parseFloat(seconds, 10)

                    p.setAttribute('data-time', newTime)  // 给p标签赋值一个data-time标志，值为newTime
                } else {
                    p.textContent = string
                }
                this.$el.find('.lyric>.lines').append(p)
            })
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
        showlyric(time) {  // 根据时间展示歌词 原理：时间time流动到某两个紧挨的P标签的data-time之间就打印上一个p标签
            let allP = this.$el.find('.lyric>.lines>p')
            this.$el.find('.lyric').css('border', '1px solid red')
            let p
            for (let i = 0; i < allP.length; i++) {
                if (i === allP.length - 1) {
                    // console.log(allP[i])
                    p = allP[i]
                    break
                } else {
                    let currentTime = allP.eq(i).attr('data-time')
                    let nextTime = allP.eq(i + 1).attr('data-time')
                    if (currentTime <= time && time < nextTime) {
                        // console.log(allP[i])
                        p = allP[i]
                        break
                    }
                }
            }
            let pHeight = p.getBoundingClientRect().top
            let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
            let Height = pHeight - linesHeight
            this.$el.find('.lyric>.lines').css({ 
                transform: `translateY(${-(Height-25)}px)` 
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
        },
        play() {  // 播放音乐
            this.$el.find('audio')[0].play()
            // let  audio = this.$el.find('audio')[0]
            // audio.play()
        },
        pause() {  // 暂停音乐
            this.$el.find('audio')[0].pause()
            // let  audio = this.$el.find('audio')[0]
            // audio.pause()
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: ''
            },
            status: 'paused'

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
            return query.get(id).then((song) => {  // 不能用function，否则会变成this会变成window
                // console.log(song)
                Object.assign(this.data.song, { id: song.id, ...song.attributes })
                return song
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            // console.log(id)
            this.model.get(id).then(() => {
                console.log(this.model.data)
                this.view.render(this.model.data)
                // this.view.play()
                // setTimeout(()=>{  // 好像浏览器不允许开发者控制播放
                //     this.view.play()
                // },3000)
            })
            this.bindEvents()
        },
        bindEvents() {
            $(this.view.el).on('click', '.icon-play', () => {  //事件委托
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click', '.icon-pause', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            // $(this.view.el).on('click','.icon-wrapper',()=>{
            //     this.view.pause()
            // })
            window.eventHub.on('songEnd', () => {
                this.model.data.status = 'pause'
                this.view.render(this.model.data)
            })
        },
        getSongId() {
            let search = window.location.search
            // console.log(search)
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            // console.log(search)
            let array = search.split('&').filter((v => v))  // 通过加filter可以过滤空字符串
            // console.log(array)

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

