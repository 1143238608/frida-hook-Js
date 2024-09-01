
function hookDeviceInfo2(ts){
    var result = null;
    Java.perform(function(){
        let BaseApplication = Java.use( "com.xunmeng.pinduoduo.basekit.BaseApplication");
        var context = BaseApplication.getContext();
        console.log(context);
    //获取当前本地时间的时间戳//
    //     let TimeStamp = Java.use("com.xunmeng.pinduoduo.d.l");
    //     var _ts = TimeStamp.c.overload('java.lang.Long')(ts);
        try {
        // 调用 SecureNative.deviceInfo2 方法，并传入时间戳参数
            let SecureNative = Java.use(  "com.xunmeng.pinduoduo.secure.SecureNative");
            var Long = Java.use(  "java.lang.Long");
            result = SecureNative.deviceInfo2(context, Long.valueOf(ts));
            console.log(result);
        }catch(error) {
            console.error("Error occurred:", error);
            //在出现异常时返回一个默认值，避免返回空值
            result = "Error occurred:" + error.toString();
        }
        });
            return result;
}

function hookInfo2() {
    Java.perform(function () {
        var deviceNative = Java.use("com.xunmeng.pinduoduo.secure.DeviceNative");
        deviceNative.info2.implementation = function(arg1, arg2){
        var retval = this.info2(arg1, arg2);
        console.log(arg1,arg2,retval);
        return retval;
        };
    })

}

function hookInfo3() {
    Java.perform(function () {
        var deviceNative = Java.use("com.xunmeng.pinduoduo.secure.DeviceNative");
        deviceNative.info3.implementation = function (arg1, arg2) {
            var retval = this.info3(arg1, arg2);
            console.log(arg1, arg2, retval);
            return retval;
        };
    })
}


function hookSecureNative() {
    Java.perform(function () {
        var secureNative = Java.use("com.xunmeng.pinduoduo.secure.SecureNative");
        secureNative.deviceInfo2.implementation = function (arg1, arg2) {
            var retval = this.deviceInfo2(arg1, arg2);
            console.log(arg1, arg2, retval);
            return retval;
        };
    })
}

function hookContext() {
    Java.perform(function () {
        var context = Java.use("android/content/Context");
        context.checkSelfPermission.implementation = function (arg1) {
            var res = this.checkSelfPermission(arg1);
            console.log(arg1, res);
            return res;
        }
    })
}

function hook_c() {
    Java.perform(function () {
        var a = Java.use('com.aimi.android.common.http.a');
        a.c.implementation = function (arg1, arg2) {
            var result = this.c(arg1, arg2);
            console.log(arg1, arg2);
            console.log(JSON.stringify(result))
            return result;
        }
    })
}


function main() {
    // hookInfo2();
    // hookInfo2_("1715686687789");
    // hookInfo3();
    // hookSecureNative();
    // hookContext();
    // hook_c();
    hookDeviceInfo2("1715686687789");
}

setImmediate(main);