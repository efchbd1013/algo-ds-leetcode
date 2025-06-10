public class Solution {
    public void ReverseString(char[] s) {
       char temp='\0';
        for(int i=s.Length/2; i<s.Length;i++)
        {
            temp=s[s.Length-1-i];
            s[s.Length-1-i]=s[i];
            s[i]=temp;
        }
    }
}