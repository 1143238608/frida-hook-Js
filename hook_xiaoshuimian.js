function hook_sign(){
    Java.perform(function (){
        var sinnger = Java.use("com.psyone.brainmusic.utils.Sinnger");
        sinnger.sign.implementation = function ( context, map, str){
            console.log(map, str);
            var result = this.sign(context, map, str);
            console.log(result);
            return result;
        }
    })
}

function hook_GetSig(){
    Java.perform(function (){
        var base = Java.use("com.psyone.brainmusic.utils.Base");
        base.GetSig.implementation = function (context, bArr,  str){
            var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
            console.log(stack);
            console.log('context-->',context);
            console.log('bArr-->',bArr);
            console.log('str-->', str);
            var result = this.GetSig(context, bArr,  str);
            console.log(result);
            return result;
        }
    })
}

function hook_so_md5(){
    // var soAddr = Module.findBaseAddress("libbase.so");
    var soAddr = ptr(0x7151e92000);
    // console.log(soAddr);
    var funcAddr = soAddr.add(0x1c2c);
    // var funcAddr = Module.findExportByName("libbase.so", "Java_com_psyone_brainmusic_utils_Base_GetSig");
    // console.log(funcAddr)
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('\narg1-->'+args[1].readCString());
            console.log('arg2-->'+args[1].readCString());
            this.arg2 = args[2];
        },
        onLeave:function(retval){
            // console.log('retval-->'+this.arg2);
            // console.log("res-->"+retval.readCString())
        }
    })

}

function hook_so_md5_final(){
    var soAddr = ptr(0x7151e92000);
    // console.log(soAddr);
    var funcAddr = soAddr.add(0x1c2c);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            console.log('final_arg0-->',args[0].readCString());
            console.log('final_arg1-->',args[1].readCString());
            this.arg1 = args[0];
        },
        onLeave:function(retval){
            console.log('final_res-->',this.arg1.readCString());
        }
    })
}
function hook_dlsym() {
    let dlsymAddr = Module.findExportByName('libbase.so', 'dlsym')
    console.log(dlsymAddr)
    Interceptor.attach(dlsymAddr, {
        onEnter: function (args) {
            this.args1 = args[1]
        },
        onLeave: function (retval) {
            let module = Process.findModuleByAddress(retval)
            if (module == null) {return retval;}
            // console.log(this.args1.readCString(), module.name, retval, retval.sub(module.base))
            var functionName = this.args1.readCString();
            if(functionName.indexOf("GetSig")!==-1){
                console.log(module.name,module.base);
                console.log("\t",functionName);
            }
            return retval;
        },
    })
}


function main(){
    // hook_sign();
    hook_GetSig();
    // hook_so_md5();
    // hook_so_md5_final();
    // hook_dlsym();    //先运行获取包含导出函数的libbase.so文件
}



setImmediate(main)