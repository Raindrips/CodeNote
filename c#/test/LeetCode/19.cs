using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _19
{


    public class Solution
    {
        public ListNode RemoveNthFromEnd(ListNode head, int n)
        {
            List<ListNode> list = new List<ListNode>();
            int c = 0;
            ListNode? temp = head;
            while (temp != null)
            {
                list.Add(temp);
                temp = temp.next;
                c++;
            }
            int i = list.Count - n;
            if (i == 0)
            {
                return head.next!;
            }
            else
            {
                list[i - 1].next = list[i].next;
                return head;
            }
        }
    }
    class Test
    {
        private static void T(ListNode head, int n)
        {

            var solution = new Solution();

            Printer.Print(solution.RemoveNthFromEnd(head, n));
        }

        public static void Run()
        {

            ListNodeHelper list = new ListNodeHelper([1, 2, 3, 4, 5]);
            ListNodeHelper list2 = new ListNodeHelper([1]);
            ListNodeHelper list3 = new ListNodeHelper([1, 2]);


            Test.T(list.GetHead(), 2);
            Test.T(list2.GetHead(), 1);
            Test.T(list3.GetHead(), 1);

        }
    }
}
