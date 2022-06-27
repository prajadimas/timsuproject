const suHelper = (hex) => {
    const radix = 16;
    let str = "";
    for (let i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), radix));
    }
    return str;
}


/**
 * Helpers function for timon project
 * with input value should be hex string with length of 26
 * 
 * @param {string} value hex string value to convert
 * @example
 * 
 * 020D2B31323334353631310603
 * 
 */
const helpers = {
    valueAsText: function (value) {
        const datasu = value.substring(2, 24).match(/.{1,2}/g);
        const commpos = Number(datasu[8].slice(-1));
        const suval = [datasu[2], datasu[3], datasu[4], datasu[5], datasu[6], datasu[7]].join("");
        let tempval = suHelper(suval);
        return (tempval.substring(0, tempval.length - commpos) + "." + tempval.substring(tempval.length - commpos, tempval.length));
    },
    valueAsNumber: function (value) {
        const datasu = value.substring(2, 24).match(/.{1,2}/g);
        const commpos = Number(datasu[8].slice(-1));
        const suval = [datasu[2], datasu[3], datasu[4], datasu[5], datasu[6], datasu[7]].join("");
        let tempval = suHelper(suval);
        return Number(tempval.substring(0, tempval.length - commpos) + "." + tempval.substring(tempval.length - commpos, tempval.length));
    },
    completeValueText: function (value) {
        const datasu = value.substring(2, 24).match(/.{1,2}/g);
        let polarity = "+";
        let unit = "kg";
        datasu[1] === "2B" ? polarity = "+" : polarity = "-";
        const commpos = Number(datasu[8].slice(-1));
        const suval = [datasu[2], datasu[3], datasu[4], datasu[5], datasu[6], datasu[7]].join("");
        let tempval = suHelper(suval);
        return polarity + "" + (tempval.substring(0, tempval.length - commpos) + "." + tempval.substring(tempval.length - commpos, tempval.length)) + "" + unit;
    }
}

export default helpers;