using LeetCode;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _23
{
    public class Solution
    {
        public ListNode? MergeKLists(ListNode[] lists)
        {
            if (lists.Length <= 0)
            {
                return null;
            }
            ListNode? result = null;
            ListNode? temp = null;
            PriorityQueue<ListNode, int> pq = new PriorityQueue<ListNode, int>();
            for (int i = 0; i < lists.Length; i++)
            {
                temp = lists[i];
                while (temp != null)
                {
                    pq.Enqueue(temp, temp.val);
                    temp = temp.next;
                }
            }
            while (pq.Count > 0)
            {
                if (result == null)
                {
                    result = pq.Dequeue();
                    temp = result;
                    temp.next = null;
                }
                else
                {
                    temp!.next = pq.Dequeue();
                    temp = temp.next;
                    temp.next = null;
                }
            }

            return result;
        }


    }
    class Test
    {
        private static void T(ListNode[] lists)
        {
            var solution = new Solution();
            Printer.Print(solution.MergeKLists(lists));
        }

        private static ListNode NewList(int[] arr)
        {
            return new ListNodeHelper(arr).GetHead();
        }

        public static void Run()
        {
            var N = NewList;

            ListNode[] lists = [N([1, 4, 5]), N([1, 3, 4]), N([2, 6])];

            Test.T(lists);
            Test.T([]);
            Test.T([N([])]);
            Test.T([N([1, 2, 2]), N([1, 1, 2])]);



        }
    }
}
