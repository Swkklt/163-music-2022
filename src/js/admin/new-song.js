// !function(){}() ES6之前的立即执行函数语法
// 下边是ES6的语法
{
    let view = {
        el:'.newSong',
        template:`
        新 建 歌 曲
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            window.eventHub.on('new',(data)=>{
                this.active()
            })
            window.eventHub.on('select',(data)=>{
                // console.log(data.id)
                this.deactive()
            })
            $(this.view.el).on('click',()=>{
                window.eventHub.emit('new')
            })
        },
        active(){
            $(this.view.el).addClass('active')
        },
        deactive(){
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view,model)
    // window.app.newSong = controller
}