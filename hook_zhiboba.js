function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    console.log("load " + path);
                }
            }
        }
    );
}

function hook_pthread_create() {
    // console.log("libnesec.so --- " + Process.findModuleByName("libnesec.so").base)
    Interceptor.attach(Module.findExportByName("libc.so", "pthread_create"), {
        onEnter(args) {
            let func_addr = args[2]
            console.log("The thread function address is " + func_addr + Process.findModuleByAddress(func_addr).name);
            if (Process.findModuleByAddress(func_addr).name.indexOf("libnesec.so") != -1){
                Interceptor.replace(args[2],new NativeCallback(function(){
                    console.log("replace success")
                },'void',['void']));
            }
        }
    })
}
 


function main(){
    // hook_dlopen();
    hook_pthread_create();
    

}

setImmediate(main);