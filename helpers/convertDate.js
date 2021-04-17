export function convertDate(date, format) {

    let newDate = String(format);

    newDate = newDate.replace("YYYY", ('0' + date.getFullYear()).slice(-2));
    newDate = newDate.replace("yy", String(date.getFullYear()).slice(-2));

    newDate = newDate.replace("DD", ('0' + date.getDate()).slice(-2));
    newDate = newDate.replace("d", date.getDate());

    newDate = newDate.replace("MM", ('0' + (date.getMonth() + 1)).slice(-2));
    newDate = newDate.replace("m", (date.getMonth()));

    newDate = newDate.replace("HH", ('0' + date.getHours()).slice(-2));
    newDate = newDate.replace("h", date.getHours());

    newDate = newDate.replace("II", ('0' + (date.getMinutes() + 1)).slice(-2));
    // newDate = newDate.replace("i", (date.getMinutes()));

    newDate = newDate.replace("SS", ('0' + date.getSeconds()).slice(-2));
    // newDate = newDate.replace("s", date.getSeconds());

    return newDate;
}