

function hook_network(){
    Java.perform(function(){
        Java.use("java.net.NetworkInterface").getName.implementation = function(){
            return this.getName().replace("tun0","");
        }
    })
}

function hook_pthread_create() {
    Interceptor.attach(Module.findExportByName("libc.so", "pthread_create"), {
        onEnter(args) {
            let func_addr = args[2]
            console.log("The thread function address is " + func_addr + Process.findModuleByAddress(func_addr).name);
            if (Process.findModuleByAddress(func_addr).name.indexOf("libmsaoaidsec.so") != -1){
                Interceptor.replace(args[2],new NativeCallback(function(){
                    console.log("replace success")
                },'void',['void']));
            }
        }
    })
}
function main(){
    hook_pthread_create();
    // hook_network();
}

setImmediate(main);