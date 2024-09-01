function hook_signParamsNative(){
    Java.perform(function (){
        var HttpSecurity = Java.use("cn.yonghui.hyd.lib.utils.http.httpmiddware.HttpSecurity");
        HttpSecurity.signParamsNative.implementation =function (arg){
            console.log(arg);
            var result = this.signParamsNative(arg);
            console.log(result);
            return result;
        }
    })
}
function hook_params(){
    Java.perform(function () {
        var HttpSecurity = Java.use("cn.yonghui.hyd.lib.utils.http.httpmiddware.HttpSecurity");
        HttpSecurity.signParams.implementation =function (arg){
            console.log("加密原文---->"+arg);
            var result = this.signParams(arg);
            console.log("加密结果---->"+result);
            return result;
        }
    })
}
function hook_final(){
    var soAddr = Module.findBaseAddress("libYHJni.so");
    var funcAddr = soAddr.add(0xed0);
    Interceptor.attach(funcAddr,{
        onEnter:function(args){
            // console.log('arg0-->'+args[0].readCString());
            console.log('arg1-->'+args[1].readCString());
            this.arg1 = args[1];

        },
        onLeave:function(retval){
            // console.log('result--->'+this.arg1.readCString());
        }
    })

}
function main(){
    // hook_signParamsNative();
    hook_params();
    hook_final();
}

setImmediate(main);