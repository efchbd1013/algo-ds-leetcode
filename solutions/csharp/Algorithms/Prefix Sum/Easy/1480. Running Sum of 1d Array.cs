public class Solution {
    public int[] RunningSum(int[] nums) {
        int[] arr = new int[nums.Length];
        int sum=0;
        for(int i=0; i< nums.Length; i++)
        {
            sum+=nums[i];
            arr[i]=sum;
        }
        return arr;
    }
}