function hook_g(){
    Java.perform(function(){
        var m0 = Java.use('mf.m0');
        m0.g.overload('java.lang.String').implementation = function(str1){
            console.log(str1);
            var result = this.g(str1);
            console.log(result);
            return result;
        }

        
    })
}
function hook_c(){
    Java.perform(function(){
        var m0 = Java.use('mf.m0');
        m0.c.overload('java.util.Map', 'long', 'java.lang.String').implementation = function(arg1,arg2,arg3){
            console.log('arg1->'+arg1.keySet(),'arg2->'+arg2,'arg3->'+arg3);
            var result = this.c(arg1,arg2,arg3);
            console.log('result->'+result);
            return result; 
        }
    })
}

function hook_AES(){
    Java.perform(function(){
        var AESEncrypt = Java.use('com.duapp.aesjni.AESEncrypt');
        AESEncrypt.encode.implementation = function(arg1,arg2){
            console.log('AES->'+arg1,arg2);
            var result = this.encode(arg1,arg2);
            console.log(result);
            return result;
        }
    })
}

function hook_deAES(){
    Java.perform(function(){
        var AESEncrypt = Java.use('com.duapp.aesjni.AESEncrypt');
        AESEncrypt.decodeByte.implementation = function(arg1,arg2,arg3){
            console.log('AES->'+arg1,arg2,arg3);
            var result = this.decodeByte(arg1,arg2,arg3);
            console.log(result);
            return result;
        }
    })
}

function hook_encodeByte(){
    Java.perform(function(){
        var AESEncrypt = Java.use('com.duapp.aesjni.AESEncrypt');
        AESEncrypt.encodeByte.implementation = function(arg1,arg2){
            console.log('AES->'+arg1,arg2);
            var result = this.encodeByte(arg1,arg2);
            console.log(result);
            return result;
        }
    })
}
// 加密原文
//loginTokenplatformandroidreportItems{"contentId":"90061","pointId":"95"},{"contentId":"90064","pointId":"98"},{"contentId":"84273","pointId":"100"},{"contentId":"92847","pointId":"101"},{"contentId":"90171","pointId":"106"},{"contentId":"91486","pointId":"107"},{"contentId":"89617","pointId":"108"},{"contentId":"52701","pointId":"110"}timestamp1714141181993uuid1b0cc47624a980dav5.25.1
//加密结果
//knGGXR0bR7LQn4eRCvJsdUI/ZDJvCi67kP1b6XLrr7B8Bv5OyV2sUNh/iwPVC9eTSof/CgkEVYNRQ3LKhUOJqtn/Vxx3ihocj1YkjRylIRiqQUGqnW7rNA/lVeLiQg3AsU7bLKUNsWw+bI3NZQFRPZiYNzmj0s2xfrmxw2+pllqPFwthj7V5u4bRRBbrKFmqOHnFDsgutq02Il1ZVfNVJqXvnEq+XzFv2YO0xtJWdjQfmK6L2WzZ17QOqhT4nMgGmKLZUbvDEZl1bduzXKlcxJAlQTKlvpUtxRvoKJ5eFD+rMzX/CV0h+sifVJsBo38YBAgmOWajToOorS5cgeHBz423MJcedCP7SoQjOkIsztZQxylSuqCOhCn7AFKO4uwC9OpPRh4fMKFOpgSrqnSdJ2zyq+dsv6EED8NykuyiRNyItg82xRwshU8FBFyan2L5l1etzE+oVNW+YI1V9JCXM2dqEJhmtl+quJS6+N1TF0beEeCKGMeWN2+WDsjzxFfBEPCxSHzVmoeOfAY9gTUNFQ==
//AES  采用的ECB pkcs7  key:d245a0ba8d678a61


function main(){
    // hook_g();
    // hook_c();
    hook_AES();
    // hook_deAES();
    // hook_encodeByte();

}

setImmediate(main)