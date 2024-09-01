// com.maihan.tredian

//
function hook_sign(){
    Java.perform(function (){
        var TreUtil = Java.use("com.maihan.tredian.util.TreUtil");
        TreUtil.sign.implementation = function (str){
            console.log('arg-->'+str);
            var result = this.sign(str);
            console.log('result-->'+result);
            return result;
        }
    })
}
function hook_sha1_input(){
    var soAddr = Module.findBaseAddress("libtre.so");
    var funcAddr = soAddr.add(0x15be + 1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            // console.log('arg1-->'+args[1].readCString(),hexdump(args[1]));
            console.log('arg1-->'+args[1].readCString());
            console.log('arg2-->'+args[2].toInt32());
            this.arg2 = args[1];
        },
        onLeave:function(retval){
            // console.log('result1111-->'+retval);
            // console.log('result-->',hexdump(this.arg2));
            return retval;
        }
    })

}
function hook_base(){
    var soAddr = Module.findBaseAddress("libtre.so");
    var funcAddr = soAddr.add(0x13b4 + 1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            // console.log('arg1-->'+args[1].readCString(),hexdump(args[1]));
            console.log('arg0-->'+args[0].readCString());
            console.log('arg1-->'+args[1].readCString());
            console.log('arg2-->'+args[2].toInt32());
            this.arg2 = args[1];
        },
        onLeave:function(retval){
            console.log('result---->'+this.arg2.readCString())
        }
    })
}
function hook_sha1(){
    var soAddr = Module.findBaseAddress("libtre.so");
    var funcAddr = soAddr.add(0x14c8 + 1);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('arg1-->'+args[1],hexdump(args[1]));
            console.log('arg2-->'+args[2],hexdump(args[2]));
            this.arg2 = args[1];
        },
        onLeave:function(retval){
            console.log('result1111-->'+retval);
            console.log('result-->',hexdump(this.arg2));
            // return retval;
        }
    })

}

function main() {
    hook_sign();
    // hook_sha1();
    // hook_sha1_input();
    hook_base();
}

setImmediate(main);
