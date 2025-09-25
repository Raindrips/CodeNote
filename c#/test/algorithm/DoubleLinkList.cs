using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace algorithm
{
    public class DNode
    {
        public int val;
        public DNode? next = null;
        public DNode? prev = null;
        public DNode(int val)
        {
            this.val = val;
        }

        public void LinkNext(DNode node)
        {
            this.next = node;
            node.prev = this;
        }

        public void LinkPrev(DNode node)
        {
            this.prev = node;
            node.next = this;
        }

    }
    public class DoubleLinkList : IEnumerable<int>
    {
        public DNode? first = null;
        public DNode? last = null;

        private int _count = 0;
        public int Count
        {
            get { return _count; }
        }

        public DoubleLinkList()
        {

        }

        public void AddLast(int val)
        {
            DNode node = CreateNode(val);

            if (Count == 0)
            {
                last = first = node;
            }
            else
            {
                node.LinkPrev(last);
                last = node;
            }
            _count++;

        }

        public void AddFirst(int val)
        {
            DNode node = CreateNode(val);


            if (Count == 0)
            {
                last = first = node;
            }
            else
            {
                node.LinkNext(first);
                first = node;
            }
            _count++;
        }

        public void RemoveFirst()
        {
            if (Count == 0)
            {
                return;
            }
            if (Count == 1)
            {
                first = null;
                last = null;
            }
            else
            {
                first = first.next;
                first.prev = null;
            }
            _count--;
        }

        public void RemoveLast()
        {
            if (Count == 0)
            {
                return;
            }
            if (Count == 1)
            {
                first = null;
                last = null;
            }
            else
            {
                last = last.prev;
                last.next = null;
            }

            _count--;
        }


        protected DNode CreateNode(int val)
        {
            return new DNode(val);
        }

        // 正向遍历
        public IEnumerable<int> Forward()
        {
            DNode? temp = first;
            while (temp != null)
            {
                yield return temp.val;
                temp = temp.next;
            }
        }

        // 反向遍历
        public IEnumerable<int> Backward()
        {
            DNode? temp = last;
            while (temp != null)
            {
                yield return temp.val;
                temp = temp.prev;
            }
        }

        public IEnumerator<int> GetEnumerator()
        {
            return Forward().GetEnumerator();
        }

        // 实现非泛型 IEnumerator
        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
