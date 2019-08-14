export function makeid(length) {
    var retValue = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        retValue += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return retValue;
}