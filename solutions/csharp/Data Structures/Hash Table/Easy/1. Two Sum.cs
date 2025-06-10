public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        int[] res=new int[2];
        res[0]=res[1]=int.MaxValue;
        int second=0;
        Dictionary<int, int> dict=new Dictionary<int, int>();
        foreach(int item in nums) 
        {
            if(!dict.ContainsKey(item))
                dict.Add(item, 1);
            else
            {dict[item]++;}
        }
        for(int i=0; i<nums.Length;i++)
        {
            second=target-nums[i];
            if((second==nums[i] && dict[nums[i]]>1) )
              res[0]=i;
            else if(second!=nums[i]&& dict.ContainsKey(target-nums[i]))
                              res[0]=i;

        }
        for(int i=0; i<nums.Length;i++)
        {
            if(nums[i]==target-nums[res[0]] && i!=res[0])
               res[1]=i;
        }
            
        
        return res; 
    }
}