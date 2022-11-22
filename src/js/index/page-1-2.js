{
    let view = {
        el: 'section.songs',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data
            songs.map((song)=>{
                let $li = $(`
                <li>
                    <h3>${song.name}</h3>
                    <p>
                        <svg class="icon icon-sq">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq">
                            </use>
                        </svg>
                        ${song.singer}
                    </p>
                    <a class="playButton" href="#">
                        <svg class="icon icon-play">
                            <use xmlns:xlink="http://www/w3/org/1999/xlink" xlink:href="#icon-play">
                            </use>
                        </svg>
                    </a>
                </li>
                `)
                this.$el.find('ol.list').append($li)
            })
        }
    }
    let model = {
        data:{
            songs:[]
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
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}