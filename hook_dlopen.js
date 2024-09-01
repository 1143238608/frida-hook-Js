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

function hook_dlsym() {
    let dlsymAddr = Module.findExportByName('libdl.so', 'dlsym')
    console.log(dlsymAddr)
    Interceptor.attach(dlsymAddr, {
        onEnter: function (args) {
            this.args1 = args[1]
        },
        onLeave: function (retval) {
            let module = Process.findModuleByAddress(retval)
            if (module == null) return
            console.log(this.args1.readCString(), module.name, retval, retval.sub(module.base))
        },
    })
}

function main(){
    hook_dlopen();
    // hook_pthread_create();
}

setImmediate(main);