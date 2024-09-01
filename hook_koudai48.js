// com.pocket.snh48.activity
// frida -U -f com.pocket.snh48.activity -l hook_koudai48.js --no-pause
// {"type":"function","name":"_ZN7MD5_CTX11MakePassMD5EPhjS0_","address":"0x744e8b8a38"}

function hook_export() {
    var exports = Module.enumerateExports("libencryptlib.so");
    for (var i = 0; i < exports.length; i++) {
        //if(exports[i].name == "strncat"){
        console.log(JSON.stringify(exports[i]));

        //}
    }

    var helloAddr = Module.findExportByName("libencryptlib.so", "_ZN7MD5_CTX11MakePassMD5EPhjS0_");
    console.log(helloAddr);
}
function hook_md5(){
    var MakePassMD5 = Module.findExportByName("libencryptlib.so", "_ZN7MD5_CTX11MakePassMD5EPhjS0_");
    console.log(MakePassMD5);
    if(MakePassMD5 != null){
        Interceptor.attach(MakePassMD5,{
            onEnter: function(args){
                // console.log(args[0]);
                console.log("args[1]",hexdump(args[1]));
                console.log("args[2]",args[2].toInt32());
                console.log("args[3]",hexdump(args[3]));
                this.arg3 = args[3];
            },
            onLeave: function(retval){
                // console.log("retval", retval.toInt32());
                console.log('result',hexdump(this.arg3));
            }
        });
    }
}

function hook_symbols(){
    var symbols = Module.enumerateExports("libencryptlib.so");
    for(var i = 0; i < symbols.length; i++) {
        console.log(symbols[i].name+' '+symbols[i].address);
    }
}
function main() {
    // hook_export();
    hook_md5();
    // hook_symbols();
}


setImmediate(main)
