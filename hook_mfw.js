function hook_sign(){
    Java.perform(function (){
        var AuthorizeHelper = Java.use("com.mfw.tnative.AuthorizeHelper");
        AuthorizeHelper.xAuthencode.implementation = function (arg1,arg2,arg3,arg4,arg5) {
            console.log('\narg1--->'+arg1);
            console.log('arg2--->'+arg2);
            console.log('arg3--->'+arg3);
            console.log('arg4--->'+arg4);
            console.log('arg5--->'+arg5);
            var result = this.xAuthencode(arg1,arg2,arg3,arg4,arg5);
            console.log('result--->'+result);
            return result;
        }
    })
}

function hook_base64(){
    var soAddr = Module.findBaseAddress("libmfw.so");
    var funcAddr = soAddr.add(0x6e3c + 1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('\narg0-->'+args[0].readCString());
            console.log('arg1-->'+args[1].readCString());
            console.log('arg2-->'+args[2].toInt32());
        },
        onLeave:function(retval){
            console.log('result--->'+retval.readCString());
        }
    })
}

function hook_update(){
    var soAddr = Module.findBaseAddress("libmfw.so");
    var funcAddr = soAddr.add(0x82a4 + 1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('\narg0-->'+args[0].readCString());
            console.log('arg1-->'+args[1].readCString());
            console.log('arg2-->'+args[2].toUInt32());
            console.log('arg3-->'+args[3]);
        },
        onLeave:function(retval){
            console.log('result--->'+retval.toUInt32());
        }
    })
}

function hook_setKey(){
    var soAddr = Module.findBaseAddress("libmfw.so");
    var funcAddr = soAddr.add(0x6938 + 1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('\narg0-->'+args[0].readCString());
            console.log('arg1-->'+args[1].readCString());
            console.log('arg2-->'+args[2].toInt32());
        },
        onLeave:function(retval){
            console.log('result--->'+retval.toUInt32());
        }
    })
}
function main(){
    hook_sign();
    // hook_base64();
    // hook_update();
    // hook_setKey();
}

setImmediate(main);