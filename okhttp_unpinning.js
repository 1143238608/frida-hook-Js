var classesNames = new Array()
var OkhttpClientClassName = ""
var CertificatePinnerClassName = ""
var prefix = ""

function loadOkhttpClient(){
    Java.perform(function (){
        try{
            Java.use("okhttp3.OkHttpClient")
        }catch(e){
            //console.error(e)
        }
    })

}

function loadClasses(){
    Java.perform(function (){
        Java.enumerateLoadedClasses({
            onMatch: function(clsName, handle){
                classesNames.push(clsName)
            },
            onComplete: function(){
                console.log("Search Class Completed!")
            }
        })
    })
}

function findOkhttpClass(){
    Java.perform(function (){
        var Modifier = Java.use("java.lang.reflect.Modifier")
        function isOkhttpClient(clsName){
            if(clsName.split('.').length != 2){
                return false;
            }

            try{
                var cls = Java.use(clsName)
                var interfaces = cls.class.getInterfaces()
                const count = interfaces.length
                //console.log(count)
                if(count < 2){
                    return false
                }
                var flag = false
                for(var i = 0; i < count; i++){
                    var interface_ = interfaces[i]
                    var interface_name = interface_.getName()

                    if(interface_name.indexOf("Cloneable") > 0){
                        flag = true
                    }else{
                        if(interface_name.indexOf("$") <= 0){
                            return false
                        }
                    }
                }
                if(!flag) return false;


                if(cls.class.getDeclaredClasses().length < 1){
                    return false
                }

                if(cls.class.getSuperclass().getName() != 'java.lang.Object'){
                    return false
                }

            }catch(e){
                return false
            }
            return true;
        }

        function isCertificatePinner(clsName,prefix){

            if(!clsName.startsWith(prefix)){
                return false
            }

            if(clsName.indexOf("$") > 0){
                return false
            }

            if(clsName.split('.').length != 2){
                return false;
            }

            var cls = Java.use(clsName)
            if(cls.class.isInterface()){
                return false
            }


            if(cls.class.getInterfaces().length > 0){
                return false
            }


            if(cls.class.getDeclaredClasses().length < 1){
                return false
            }

            if(cls.class.getSuperclass().getName() != "java.lang.Object"){
                return false
            }

            if(!Modifier.isFinal(cls.class.getModifiers())){
                return false
            }
            var flag = false
            var methods = cls.class.getDeclaredMethods()
            for(var i = 0; i < methods.length; i++){
                var method = methods[i]
                if(method.getParameterCount() < 1){
                    continue
                }
                if(method.getParameterTypes()[0].getName() == "java.security.cert.Certificate"){
                    flag = true
                    break
                }
            }
            if(!flag) return false

            flag = false
            var fields = cls.class.getDeclaredFields()
            for(var k = 0; k < fields.length; k++){
                var field = fields[k];
                if(field.getType().getName() == "java.util.Set"){
                    flag = true
                    break
                }
            }
            if(!flag) return false

            console.log(clsName)
            return true
        }

        for(var i = 0; i < classesNames.length; i++){
            if(isOkhttpClient(classesNames[i])){
                OkhttpClientClassName = classesNames[i]
                //console.log(OkhttpClientClassName)
                var splits = classesNames[i].split('.')
                var len = splits.length
                for(var j = 0; j < len-1; j++){
                    prefix = prefix + splits[j] + '.'
                }
            }
        }

        for(var i = 0; i < classesNames.length; i++){
            if(isCertificatePinner(classesNames[i],prefix)){
                CertificatePinnerClassName = classesNames[i]
                //console.log(CertificatePinnerClassName)
            }
        }

        console.error("Found Class: "+classesNames.length)
        console.error("Okhttp's package prefix: "+prefix)
        console.error("Find the OkhttpClient: "+OkhttpClientClassName)
        console.error("Find the OkhttpCertificatePinner: "+CertificatePinnerClassName)

        if(OkhttpClientClassName == "" || CertificatePinnerClassName == "" || prefix == ""){
            console.error("Can't find the okhttp class")
            return
        }
    })
}

function hook(){
    Java.perform(function (){
        var Modifier = Java.use("java.lang.reflect.Modifier")
        //TrustAllManager
        var TrustAllManagerClass = Java.registerClass({
            name: "TrustAllManager",
            implements:[Java.use("javax.net.ssl.X509TrustManager")],
            methods: {
                checkClientTrusted(chain, authType) {
                    console.log("checkClientTrusted Called!!")
                },
                checkServerTrusted(chain, authType) {
                    console.log("checkServerTrusted Called!!")
                },
                getAcceptedIssuers() {
                    return [];
                },
            }
        })
        var trustAllManagerHandle = TrustAllManagerClass.$new()

        var sslContext = Java.use("javax.net.ssl.SSLContext").getInstance("TLS")
        sslContext.init(null,Java.array("Ljavax.net.ssl.X509TrustManager;",[trustAllManagerHandle]),null)
        var sslSocketFactory = sslContext.getSocketFactory()

        //HostnameVerify
        var MyHostnameVerify = Java.registerClass({
            name: "MyHostnameVerify",
            implements:[Java.use("javax.net.ssl.HostnameVerifier")],
            methods: {
                verify(hostname, session){
                    console.log(hostname)
                    return true
                }
            }
        })
        var myHostnameVerifyHandle = MyHostnameVerify.$new()
        var BuilderClassName = Java.use(OkhttpClientClassName).class.getDeclaredClasses()[0].getName()
        var OkhttpClient$Buidler = Java.use(BuilderClassName)

        var methods = OkhttpClient$Buidler.class.getDeclaredMethods()

        for(var i = 0; i < methods.length; i++){
            var method = methods[i]
            if(method.getParameterCount() < 1){
                continue
            }
            if(method.getParameterTypes()[0].getName() == "javax.net.ssl.SSLSocketFactory"){
                var sslSocketFacotryMethodName  = method.getName()
                var len = OkhttpClient$Buidler[sslSocketFacotryMethodName].overloads.length
                for(var j = 0; j < len; j++){
                    OkhttpClient$Buidler[sslSocketFacotryMethodName].overloads[j].implementation = function(SSLSocketFactory){
                        arguments[0] = sslSocketFactory
                        return this[sslSocketFacotryMethodName].apply(this,arguments)
                    }
                }
                console.log(sslSocketFacotryMethodName,"Hooked!")
            }
            if(method.getParameterTypes()[0].getName() == "javax.net.ssl.HostnameVerifier"){
                var hostnameVerifierMethodName = method.getName()

                var len = OkhttpClient$Buidler[hostnameVerifierMethodName].overloads.length
                for(var j = 0; j < len; j++){
                    OkhttpClient$Buidler[hostnameVerifierMethodName].overloads[j].implementation = function(hostnameVerifier){
                        arguments[0] = myHostnameVerifyHandle
                        return this[hostnameVerifierMethodName].apply(this,arguments)
                    }
                }
                console.log(hostnameVerifierMethodName, "Hooked!")
            }

            if(method.getParameterTypes()[0].getName() == CertificatePinnerClassName){
                var CertificatePinnerClass = Java.use(CertificatePinnerClassName)
                var certificatePinnerMethodName = method.getName()
                var len = OkhttpClient$Buidler[certificatePinnerMethodName].overloads.length
                for(var j = 0; j < len; j++){
                    OkhttpClient$Buidler[certificatePinnerMethodName].overloads[j].implementation = function(){
                        console.log("certificatePinner add called!")
                        var fields = CertificatePinnerClass.class.getDeclaredFields()
                        for(var k = 0; k < fields.length; k++){
                            var field = fields[k];
                            var modifiers = field.getModifiers()
                            if(Modifier.isFinal(modifiers) && Modifier.isStatic(modifiers) && Modifier.isPublic(modifiers)){
                                arguments[0] = field.get(CertificatePinnerClass.class)
                            }
                        }
                        return this[certificatePinnerMethodName].apply(this,arguments)
                    }
                }
                console.log( method.getName(),"Hooked!")
            }
        }

        var CertificatePinnerClass = Java.use(CertificatePinnerClassName)
        var methods = CertificatePinnerClass.class.getDeclaredMethods()
        for (var i = 0; i < methods.length; i++){
            var method = methods[i]
            if(method.getReturnType().getName() == 'void'){
                var methodName = method.getName()
                console.log(methodName+" Hooked!")
                var m_len = CertificatePinnerClass[methodName].overloads.length

                for (var j = 0; j < m_len; j++){
                    if(CertificatePinnerClass[methodName].overloads[j].returnType.name == 'V'){
                        CertificatePinnerClass[methodName].overloads[j].implementation = function(){
                            console.log("certificatePinner check called!")
                        }
                    }
                }
            }
        }
    })
}

function main(){
    loadOkhttpClient()
    loadClasses()
    findOkhttpClass()
    hook()
}
setImmediate(main)