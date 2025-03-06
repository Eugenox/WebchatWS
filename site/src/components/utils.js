export function FormateDate (date){
    const time = new Date(date);

    const H = String(time.getHours()).padStart(2, '0');
    const M = String(time.getMinutes()).padStart(2, '0');
    const S = String(time.getSeconds()).padStart(2, '0');

    return `${H}:${M}:${S}`;
}