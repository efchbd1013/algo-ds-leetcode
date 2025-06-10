public class Solution {
    public bool CanConstruct(string ransomNote, string magazine) {
        Dictionary<char, int> magazineLetters = new Dictionary<char, int>();
        
        // סופרים את כל האותיות במחרוזת magazine
        foreach (char letter in magazine) {
            if (magazineLetters.ContainsKey(letter)) {
                magazineLetters[letter]++;
            } else {
                magazineLetters[letter] = 1;
            }
        }
        
        // בודקים אם כל אות ב-ransomNote קיימת במספיק עותקים במילון
        foreach (char letter in ransomNote) {
            if (!magazineLetters.ContainsKey(letter) || magazineLetters[letter] == 0) {
                return false; // האות חסרה או שאין מספיק עותקים
            }
            magazineLetters[letter]--; // מפחיתים עותק אחד מהאות
        }
        
        return true; // כל האותיות הנדרשות קיימות במגזין
    }
} 