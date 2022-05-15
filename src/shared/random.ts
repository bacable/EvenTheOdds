export abstract class Random {
    public static shuffle(array:any[]) {
        var startI = array.length - 1;
        for(var i = startI; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
          }
    }
}