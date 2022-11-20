// !function(){}() ES6之前的立即执行函数语法
// 下边是ES6的语法
{
    let view = {
        el: '#songList-container',
        template: `
            <ul class="songList">
            </ul>
        `,
        render(data) { // render：渲染
            $(this.el).html(this.template)
            let { songs } = data
            // let liList = songs.map((song)=>{
            //     let li = $('<li></li>').text(song.name)
            //     return li 
            // })
            // 上边的一段等价于下边的一行
            let liList = songs.map((song) => 
                $('<li></li>').text(song.name).attr('data-song-id',song.id)
            )
            let $el = $(this.el)
            $el.find('ul').empty() // 清空ul里边的内容
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })
        },
        activeItem(li){
            let $li = $(li)
            $li.addClass('active')
               .siblings('.active').removeClass('active')
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            // 从leanCloud数据库批量查询歌曲
            var query = new AV.Query('Song')
            //  console.log(query)  // 从queryAPI的prototype的object里可以找到find方法
            return query.find().then((songs) => {  // 必须返回一个promise，query.find()就是一个promise
                // console.log(x) // x/songs  
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                }) 
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        getAllSongs(){
            return this.model.find().then(()=>{ //return可以随便加
                // console.log(this.model.data)
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{ //点击li标签触发函数
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                let data
                let songs = this.model.data.songs
                for(let i=0; i<songs.length;i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                let string = JSON.stringify(data) // 深拷贝一下，避免出bug
                let object = JSON.parse(string)  // 深拷贝一下，避免出bug
                window.eventHub.emit('select',object)
            })
        },
        bindEventHub(){
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('update',(song)=>{
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i],song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
    // window.app.songList = controller
}