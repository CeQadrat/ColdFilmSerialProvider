class ColdFilmSP{
    constructor(seralName){
        this.serialName = seralName;
    }
    get getSeries(){
        return function* gen(){
            let i=1;
            yield i;
        }
    }
}