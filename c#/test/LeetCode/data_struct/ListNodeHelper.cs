using System.Text;

namespace LeetCode
{
    public class ListNode
    {
        public int val;
        public ListNode? next;
        public ListNode(int val = 0, ListNode? next = null)
        {
            this.val = val;
            this.next = next;
        }
    }

    public class ListNodeHelper : IEnumerable<int>
    {
        private ListNode head;
        private int length;

        // 1. 通过数组创建链表
        public ListNodeHelper(int[] arr)
        {
            if (arr == null || arr.Length == 0)
            {
                head = null;
                length = 0;
                return;
            }
            head = new ListNode(arr[0]);
            var current = head;
            length = 1;
            for (int i = 1; i < arr.Length; i++)
            {
                current.next = new ListNode(arr[i]);
                current = current.next;
                length++;
            }
        }

        // 2. 返回迭代器
        public IEnumerator<int> GetEnumerator()
        {
            var current = head;
            while (current != null)
            {
                yield return current.val;
                current = current.next;
            }
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();

        // 3. 获取头节点
        public ListNode GetHead() => head;

        // 4. 判断长度
        public int Length => length;

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("[");
            var current = head;
            while (current != null)
            {
                sb.Append(current.val);
                sb.Append(',');
                current = current.next;
            }
            sb.Append("]");
            return sb.ToString();
        }
    }
}