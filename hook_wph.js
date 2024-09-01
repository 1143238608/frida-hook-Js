function hook_encodeStr(){
    Java.perform(function (){
        var KeyInfo = Java.use("com.vip.vcsp.KeyInfo");
        KeyInfo.esNav.implementation = function ( context,  str,  str2,  str3,  i10){
            console.log('args-->',  str);
            var res = this.esNav(context,  str,  str2,  str3,  i10);
            console.log('result-->',res);
            return res;
        }
    })
}
function hook_base64(){
    var soAddr = Module.findBaseAddress("libkeyinfo.so");
    var funcAddr = soAddr.add(0xA5056+1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('arg0-->'+args[0].readCString());
            // this.arg2 = args[2];
        },
        onLeave:function(retval){
            // console.log((this.arg2.readPointer()).readCString())
        }
    })
}

function main(){
    // hook_encodeStr();
    hook_base64();
}

setImmediate(main);