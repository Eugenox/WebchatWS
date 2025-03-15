export function FormateDate (date){
    const time = new Date(date);

    const H = String(time.getHours()).padStart(2, '0');
    const M = String(time.getMinutes()).padStart(2, '0');
    const S = String(time.getSeconds()).padStart(2, '0');

    return `${H}:${M}:${S}`;
}

//Cool article, btw.  https://en.wikipedia.org/wiki/Universally_unique_identifier
export function UUID(){
    const symbols = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"] // symbols arsenal, lol 📦
    const spacePos = [8,13,18,23] // places where we will place "-" symbol in our mega cool supa CrYpt0graph1c id
	let uuid = [];
	for (let char = 0; char < 36; char++) {
		if (spacePos.includes(char)) {
			uuid[char] = "-";
		} else {
			uuid[char] = symbols[Math.ceil(Math.random() * symbols.length - 1)]; // Making shadow magic to choose our symbol 🧙‍♂️🧙‍♂️🧙‍♂️🧙‍♂️
		}
	}
	return uuid.join("");
}