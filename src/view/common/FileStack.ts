export class FileStack<T> {
    private items:(T | null)[] = []
    private startIndex = 0
    private endIndex = 0
    private readonly maxSize: number = 0
    private currentSize: number = 0

    constructor(size: number) {
        this.maxSize = size
        this.items = new Array<T>(size);
    }
    public push(item: T) {
        if (this.currentSize == 0){
            this.items[this.endIndex] = item
            this.currentSize += 1
            return
        }
        this.endIndex = (this.endIndex+1)%this.maxSize
        this.items[this.endIndex] = item
        if (this.endIndex == this.startIndex) {
            this.startIndex = (this.startIndex+1)%this.maxSize
        }else {
            this.currentSize += 1
        }
    }
    public pop():T|null{
        if(this.endIndex != this.startIndex) {
            const temp = this.endIndex
            this.endIndex = (this.endIndex-1+this.maxSize)%this.maxSize
            const result = this.items[temp]
            this.items[temp] = null
            this.currentSize -= 1
            return result
        }
        const result = this.items[this.endIndex]
        if (result){
            this.currentSize -= 1
            this.items[this.endIndex] = null
        }
        return result
    }

    public clear(){
        this.items = new Array(this.maxSize)
        this.startIndex = 0
        this.endIndex = 0
        this.currentSize = 0
    }

    public size():number{
        return this.currentSize
    }
}