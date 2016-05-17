function alphabetSoup (str) {
  var arr = str.split('');
  arr.sort()
  return arr.join('')

}

function vowelCount (str) {
  var count = 0;
  for (var i=0; i<str.length; i++) {
    if (str[i].toLowerCase() === 'a' ||
        str[i].toLowerCase() === 'e' ||
        str[i].toLowerCase() === 'i' ||
        str[i].toLowerCase() === 'o' ||
        str[i].toLowerCase() === 'u') {
        count += 1;
      }
  }
  return count;
}

function vowelCount2 (str) {
  return str.toLowerCase().split(/[aeiou]/).length-1
}
