class ColdFilmSP{
    constructor(serialName){
        this.serialName = serialName;
    }
    get getSeries(){
        return function* gen(){
            let i=1;
            yield i;
        }
    }
}