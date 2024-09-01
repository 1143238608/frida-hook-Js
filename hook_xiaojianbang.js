function stringToBytes(str){
    return hexToBytes(stringToHex(str));
}

// Convert a ASCII string to a hex string
function stringToHex(str) {
    return str.split("").map(function(c) {
        return ("0" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join("");
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a hex string to a ASCII string
function hexToString(hexStr) {
    var hex = hexStr.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function hook_xiaojianbang() {
    var soAddr = Module.findBaseAddress("libxiaojianbang.so");
    var codeAddr = soAddr.add(0x16b4);
    console.log(codeAddr);
    Memory.protect(codeAddr,4,'rwx');
    codeAddr.writeByteArray(hexToBytes("0001094b"));
    console.log(Instruction.parse(codeAddr).toString())

    new Arm64Writer(soAddr.add(0x167c)).putNop();
    console.log(Instruction.parse(soAddr.add(0x167c)).toString())

}

function main(){
    hook_xiaojianbang();
}

setImmediate(main)