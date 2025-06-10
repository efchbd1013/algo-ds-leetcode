public class Solution {
    public int RemoveElement(int[] nums, int val) {
        int count=0, j=nums.Length-1;
        for(int i=0; i<nums.Length && i<=j; i++)
        {
            if(nums[i]==val)
            {
              while(j>=0 && nums[j]==val)
                j--;
              
              if(j>=0&&j>i)
              {
              nums[i]=nums[j];
              j--;
              count++;
              }
            }
            else
            count++;
        }
        return count;
    }
}