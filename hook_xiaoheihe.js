// com.max.xiaoheihe

function hook_s(){
    Java.perform(function (){
        var s = Java.use("com.max.xiaoheihe.utils.s");
        s.a.implementation = function (str){
            console.log(str);
            var result = this.a(str);
            console.log(result);
            return result;
        }
    })

}
function main(){
    hook_s();
}

setImmediate(main);


