class DualIndexMap<T, B extends object>{
    private idMap: Map<T, B>;
    private secIndexMap: Map<T, Set<B>>;
    private paramName:string;
    private keyName:string;
    constructor(keyName,paramName) {
        this.idMap = new Map(); // 用于通过唯一 ID 查找对象
        this.secIndexMap = new Map(); // 用于通过 paramName 查找对象
        this.paramName = paramName;
        this.keyName = keyName;
    }

    set(key:T,value:B) {

        this.idMap.set(key, value);
        let paramValue = value[this.paramName]

        if (!this.secIndexMap.has(paramValue)) {
            this.secIndexMap.set(paramValue, new Set());
        }
        const set:any = this.secIndexMap.get(paramValue)
        set.add(value);
    }

    removeBySecIndex(index) {
        const item = this.secIndexMap.get(index);
        if (item) {
            item.forEach(i=>{
                this.idMap.delete(i[this.keyName]);
            })
        }
        this.secIndexMap.set(index,new Set());
    }

    getById(id) {
        return this.idMap.get(id);
    }

    getBySecIndex(index) {
        return this.secIndexMap.get(index);
    }

    replaceAllBySecIndex(index,items:B[]) {
        this.removeBySecIndex(index)
        items.forEach(i=>{
            this.set(i[this.keyName],i);
        })
    }
}