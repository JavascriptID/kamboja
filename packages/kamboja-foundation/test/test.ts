import "reflect-metadata"

function save(){
    return (target:any)=> {
        Reflect.defineMetadata("KEY", "HELLO", target)
    }
}

function getSave(target:any){
    return Reflect.getMetadata("KEY", target)
}

@save()
class MyClass {
     
     
}
