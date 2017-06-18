

export class MongooseDecorator{
    timestamp(type:"createdAt"|"updatedAt"){
        return (...args:any[]) => {}
    }

    shortid(){
        return (constructor:any) => {}
    }
}