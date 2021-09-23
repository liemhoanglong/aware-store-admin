export default function parseDay(string) {
    string = (new Date(string)) + '';
    let dayNow = new Date() + '';
    let date;
    let dd = Number(string.slice(8, 10));
    if (dd >= 11 && dd <= 13) {
        dd += "th";
    }
    switch (dd % 10) {
        case 1: dd += "st"; break;
        case 2: dd += "nd"; break;
        case 3: dd += "rd"; break;
        default: dd += "th"; break;
    }
    let mm = string.slice(4, 7)
    let yyyy = string.slice(11, 15)
    if (string !== dayNow)
        date = string.slice(0, 3)
    else date = 'Today';
    return date + ', ' + dd + ' ' + mm + ', ' + yyyy;
}