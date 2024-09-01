// com.dachuan.news

function hook_sign(){
    Java.perform(function (){
        var SignManager = Java.use("cn.thecover.lib.common.manager.SignManager");
        SignManager.getSign.implementation = function (str,str2,str3){
            var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
            console.log(stack);
            console.log('\nstr--->',str);
            console.log('\nstr2--->',str2);
            console.log('\nstr3--->',str3);
            var result = this.getSign(str,str3,str3);
            console.log(result);
            return result;
        }
    })
}
function hook_so_sign(){
    var soAddr = Module.findBaseAddress("libwtf.so");
    var funcAddr = soAddr.add(0x43834);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('arg0-->'+args[0].readCString());
            console.log('arg1-->'+args[1].readCString());
        },
        onLeave:function(retval){
            console.log('retval-->'+retval.readCString());
        }
    })
}

function main(){
    hook_sign();
    hook_so_sign();
}

setImmediate(main)