public class Solution {
    public int MaximumWealth(int[][] accounts) {
        int max=0, sum;
        for(int i=0; i<accounts.Length; i++)
        {
            sum=0;
            for(int j=0; j<accounts[0].Length; j++)
              sum+=accounts[i][j];
            if(sum>max)
            max=sum;
        }
        return max;
    }
}