// com.hoge.android.app.fujian

function hook_toast(){
    var toast = Java.use("android.widget.Toast");
    toast.show.implementation = function (){
        var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
        console.log(stack);
        return this.show();
    }
}

function hook_checkSuFile(){
    Java.perform(function (){
        var SystemUtils = Java.use("com.hoge.android.factory.util.system.SystemUtils");
        SystemUtils.checkSuFile.implementation = function (){
            return false;
        }
        SystemUtils.checkRootFile.implementation = function () {
            return null;
        }
    })
}

function hook_signature(){
    Java.perform(function (){
        var Util = Java.use("com.hoge.android.factory.util.Util");
        Util.getRequestHeader.implementation = function(a){
            console.log('a---->'+a);
            var result = this.getRequestHeader(a);
            console.log("result--->",JSON.stringify(result));
            return result;
        }
    })
}
function hook_signature2(){
    Java.perform(function (){
        var Utils = Java.use("com.hoge.android.jni.Utils");
        Utils.signature.implementation = function(str, str2){
            console.log(str,str2);
            var result = this.signature(str,str2);
            console.log(result);
            return result;
        }
    })
}

function hook_so_sha1(){
    var soAddr = Module.findBaseAddress("libm2o_jni.so");
    var funcAddr = soAddr.add(0xa86c+1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('arg0-->'+args[0].readCString());
            console.log('arg1-->'+args[1].toInt32());
            console.log('arg2-->'+args[2].readCString());
            this.arg2 = args[2];
        },
        onLeave:function(retval){
            console.log((this.arg2.readPointer()).readCString())
        }
    })
}
function hook_hashmap(){
    var hashMap = Java.use("java.util.HashMap");
    hashMap.put.implementation = function (a, b) {
        if (a == 'X-API-SIGNATURE'){
            var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
            console.log(stack);
            console.log("a:", a, "b:", b);
        }

        return this.put(a, b);
    }

}
function main(){
    // hook_toast();
    // hook_checkSuFile();
    // hook_signature();
    // hook_signature2();
    hook_so_sha1();
    // hook_hashmap();
}

setImmediate(main);


