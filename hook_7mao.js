
//com.kmxs.reader
//frida -UF -l .\hook_7mao.js




function hook_art(){
    var dlsymAddr = Module.findExportByName(null,'dlsym');
    Interceptor.attach(dlsymAddr,{
        onEnter:function(args){
            this.funcName = args[1].readCString();
        },onLeave:function(retval){
            var moudle = Process.findModuleByAddress(retval);
            if(moudle){
                console.log(Process.findModuleByAddress(retval).name +" " +this.funcName+" "+retval.sub(moudle.base));
            }
        }
    })
}
function hook_sign(){
    var soAddr = Module.findBaseAddress("libcommon-encryption.so");
    console.log(soAddr);
    var funcAddr = soAddr.add("0x1554C");
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            // console.log('arg1',args[0],hexdump(args[0]));
            console.log('arg2',args[1],hexdump(args[1]));
        },onLeave:function(retval){
            // console.log(retval);
            // return retval
        }
    })
}

function get_java_sign(){
    Java.perform(function(){
        var encryption = Java.use('com.qimao.qmsdk.tools.encryption.Encryption');
        encryption.sign.implementation = function(arg1){
        console.log('arg1---->',arg1);
        var result = this.sign(arg1);
        console.log('result--->',result)
        return result;
    }
    })
}

function hook_so_sign(){
    Java.perform(function(){
        var Security = Java.use("com.km.encryption.api.Security");
        Security.sign.implementation = function(b){
            console.log('---->'+b);
            var result = this.sign(b);
            return result;
        }
    })
}

function hook_params(){
    Java.perform(function(){
        var fx4 = Java.use("defpackage.fx4");
        fx4.b.implementation = function(){
            var result = this.b();
            console.log(result);
            return result;
        }
    })
}

function main(){
    // hook_sign();
    // hook_art();
    get_java_sign();
    // hook_params();
}
setImmediate(main);