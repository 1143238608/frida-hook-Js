function showStacks(){

    //var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new());
    var stack = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new());
    console.log(stack);

}

function hook_md5(){
    Java.perform(function (){
        var FileListUtils = Java.use("com.androidx.lv.base.utils.FileListUtils");
        FileListUtils.getMD5.implementation = function (str){
            console.log(str);
            var result = this.getMD5(str);
            console.log(result);
            return result;
        }

    })
}

function hook_obj2(){
    Java.perform(function () {
        var c = Java.use("e.h.a.h0.o.c");
        c.onLvSuccess.implementation = function (obj){
            console.log(obj);

        }
    })
}

function hook_auth_key(){
    Java.perform(function (){
        var c = Java.use("e.c.a.a.d.c");
        c.c.implementation = function(str1,str2){
            console.log(str1,str2);
            var result = this.c(str1,str2);
            console.log(result);
            showStacks();
            return result;
        }
    })
}
function main(){
    // hook_md5();
    // hook_obj2();
    hook_auth_key();
}

setImmediate(main);