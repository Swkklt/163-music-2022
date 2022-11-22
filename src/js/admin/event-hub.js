// window.app = {}  // 设置命名空间,但是会有耦合，所以引入下边的代码
window.eventHub = {
    events:{
        // '羊城晚报': [fn],
        // '楚天都市报':[],
    },// hash
    emit(eventName,data){  //发布————trigger 触发  
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        }
    },
    on(eventName,fn){  // 订阅：eventName————订阅事件名,fn引发的函数————回调
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    },
    // off(){

    // },
}