function hook_getLineInfo(){
    var LineService = Java.use("com.sh.gj.service.LineService");
    LineService.getLineInfo.implementation = function(str,i){
        console.log(str,'---',i);
        var res = this.getLineInfo(str,i);
        console.log(res);
        return res;

    }
}
function hook_hashmap(){
    var hashMap = Java.use("java.util.HashMap");
    hashMap.put.implementation = function (a, b) {
        if (a == 'expire_time'){
            var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
            console.log(stack);
            console.log("a:", a, "b:", b);
        }

        return this.put(a, b);
    }
}

function hook_RSA(){
    var LineEncrypt = Java.use("com.sh.gj.service.LineEncrypt");
    LineEncrypt.encryptRSA.implementation = function (str1,str2){
        console.log(str1,'---',str2);
        var res = this.encryptRSA(str1,str2);
        console.log(res);
        return res;
    }
}
function hook_CBC(){
    var LineEncrypt = Java.use("com.sh.gj.service.LineEncrypt");
    LineEncrypt.encryptCBC.implementation = function ( str,  str2,  str3){
        console.log(str,'---',str2,'---',str3);
        var res = this.encryptCBC(str,  str2,  str3);
        console.log(res);
        return res;
    }
}
function main(){
    Java.perform(function (){
        // hook_getLineInfo();
        // hook_hashmap();
        hook_RSA();
        hook_CBC();
    })
}

setImmediate(main)

// com.sh.gj.service.LineService
// com.sh.gj.service.LineEncrypt