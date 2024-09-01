
function hookHmacsha1(){
    Java.perform(function(){
        var xl = Java.use('com.douban.frodo.utils.crypto.HMAcHash1');
        xl.a.overload('java.lang.String','java.lang.String').implementation = function(str1,str2){
            console.log(str1,str2);
            var res = this.a(str1,str2);
            console.log(res);
            return res;
        }
    })
}

function hook_topicApi(){
    Java.perform(function(){
        var topicApi = Java.use('com.douban.frodo.fangorns.topic.TopicApi');
        topicApi.a.overload('okhttp3.Request').implementation = function(arg1){

            var res = this.a(arg1);
            console.log(res);
            return res;
        }
    })
}

function main(){
    hookHmacsha1();
    // hook_topicApi();
}


setImmediate(main)