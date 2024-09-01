function hook_hashmap(){
    var hashMap = Java.use("java.util.HashMap");
    hashMap.put.implementation = function (a, b) {
        if (a == 'x-sign'){
            var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
            console.log(stack);
            console.log("a:", a, "b:", b);
        }

        return this.put(a, b);
    }

}

function main(){
    hook_hashmap();
}

setImmediate(main)