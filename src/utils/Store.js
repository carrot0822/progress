class Store{
    constructor(){

    }
    /**
     * 
     * @param {string} key 
     * @param {any} data 
     * @param {string} module_name 
     */
    setItem(key,data,module_name){
        if(module_name){
            let module_name_info =  this.getItem(module_name) || {}
            module_name_info[key] = value
            try{
                wx.setStorageSync(module_name, module_name_info);
            } catch(e){
                wx.setStorage({
                    key:module_name,
                    data:module_name_info
                });
            }
        }else{
            try{
                wx.setStorageSync(key, data);
            } catch(e){
                wx.setStorage({
                    key,
                    data
                });
            }
        }
    }

    getItem(key,module_name){
        if(module_name){
            let val = this.getItem(module_name)
            if(val){
                return val[key]
            }else{
                return ''
            }
        } else {
            return wx.getStorageSync(key);
        }
    }

    clear(key){
        name? wx.removeStorageSync(key):wx.clearStorage();;
    }
}
let obj = new Store()
module.exports = obj