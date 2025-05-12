public class Solution {
    public int Reverse(int x) {
        int reversed = 0;
        
        while (x != 0) {
            int digit = x % 10;

            // בדיקת חרגת טווח כאשר מנסים להוסיף ספרה נוספת
            if (reversed > (int.MaxValue / 10) || (reversed == int.MaxValue / 10 && digit > 7)) 
                return 0;
            if (reversed < (int.MinValue / 10) || (reversed == int.MinValue / 10 && digit < -8)) 
                return 0;

            reversed = reversed * 10 + digit;
            x /= 10;
        }

        return reversed;
    }
}