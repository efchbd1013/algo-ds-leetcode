public class Solution {
    public int Fib(int n) {
        if(n<=1)
            return n;
        int a=0, b=1;
        for(int i=2; i<=n; i++)
        {
            int sum=a+b;
            a=b;
            b=sum;
        }
        return b;
    }
}