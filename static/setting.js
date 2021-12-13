class Setting{
    constructor(){
        this.size = '';
        this.family = '';
        this.color = '';
        this.bgc = '';
        this.lh = '';
        this.ls = '';
    }
    init(){
        for (var i = 10; i <= 50; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerText = i + 'px';
            document.querySelector('select[name="size"]').appendChild(opt);
        }
        ["方正启体简体","微软雅黑","宋体","黑体"].forEach(v => {
            let opt = document.createElement('option');
            opt.value = v;
            opt.innerText = v;
            document.querySelector('select[name="family"]').appendChild(v);
        });
        
    }
    toJson(){
        let _this = this;
        return JSON.stringify({
            size: _this.size,
            family: _this.family,
            color: _this.color,
            bgc: _this.bgc,
            lh: _this.lh,
            ls: _this.ls
        });
    }
    fromJson(json){
        let data = JSON.parse(json);
        let _this = this;
        for (var key in data) {
            if (data.hasOwnProperty(key) && _this.hasOwnProperty(key)) {
                _this[key] = data[key];
            }
        }
    }
}
window.PageSet = new Setting();
