function decoOne() {
    return function (...args:any[]) { };
}

function decoTwo(param: string) {
    return function (...args:any[]) { };
}

export module MyModule {

    export class MyBaseClass {
        baseMethod(par1:any) { }
    }

    @decoTwo("halo")
    export class MyClass extends MyBaseClass {
        constructor() { super() }
        @decoOne()
        myMethod( @decoOne() par1:any) { }
    }
}

