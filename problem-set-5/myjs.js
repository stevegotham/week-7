// Write a function alphabetSoup that takes a single string parameter and returns the string with the letters in alphabetical order (ie. hello becomes ehllo). Assume numbers and punctuation symbols will not be included in the string.

function alphabetSoup (str) {
  var arr = str.split('');
  arr.sort()
  return arr.join('')

}

// Write a function vowelCount that takes a single string parameter and returns the number of vowels the string contains (ie. "All cows eat grass" would return 5).

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
