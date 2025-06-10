public class Solution {
    public int LengthOfLastWord(string s) {
        int num=0, prev=0;
        for(int i=0; i<s.Length; i++)
        {
            if(s[i]==' ')
            {
             if(i>0 && s[i-1]!=' ')
            prev=num;
            num=0;
            }
            else
              num++;
        }
        if(num==0)
        return prev;
        return num;
    }
}