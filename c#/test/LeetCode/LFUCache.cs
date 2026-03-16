using LeetCode;
using System;
using System.Collections.Generic;

//error LFUCache 实现，未通过测试用例
namespace LFUCache;

public class LFUCache
{
    private class Node
    {
        public int Key;
        public int Value;
        public int Freq;
        public LinkedListNode<Node> ListNode;
    }

    private readonly int capacity;
    private int minFreq;
    private readonly Dictionary<int, Node> keyToNode;
    private readonly Dictionary<int, LinkedList<Node>> freqToList;

    public LFUCache(int capacity)
    {
        this.capacity = capacity;
        this.minFreq = 0;
        keyToNode = new Dictionary<int, Node>();
        freqToList = new Dictionary<int, LinkedList<Node>>();
    }

    public int Get(int key)
    {
        if (!keyToNode.ContainsKey(key)) return -1;
        Node node = keyToNode[key];
        UpdateFreq(node);
        return node.Value;
    }

    public void Put(int key, int value)
    {
        if (capacity == 0) return;

        if (keyToNode.ContainsKey(key))
        {
            Node node = keyToNode[key];
            node.Value = value;
            UpdateFreq(node);
        }
        else
        {
            if (keyToNode.Count >= capacity)
            {
                // 淘汰 minFreq 链表的最后一个节点
                LinkedList<Node> list = freqToList[minFreq];
                Node toRemove = list.Last.Value;
                list.RemoveLast();
                keyToNode.Remove(toRemove.Key);
            }

            Node newNode = new Node { Key = key, Value = value, Freq = 1 };
            if (!freqToList.ContainsKey(1))
            {
                freqToList[1] = new LinkedList<Node>();
            }
            newNode.ListNode = freqToList[1].AddFirst(newNode);
            keyToNode[key] = newNode;
            minFreq = 1;
        }
    }

    private void UpdateFreq(Node node)
    {
        int oldFreq = node.Freq;
        LinkedList<Node> oldList = freqToList[oldFreq];
        oldList.Remove(node.ListNode);

        if (oldFreq == minFreq && oldList.Count == 0)
        {
            minFreq++;
        }

        node.Freq++;
        if (!freqToList.ContainsKey(node.Freq))
        {
            freqToList[node.Freq] = new LinkedList<Node>();
        }
        node.ListNode = freqToList[node.Freq].AddFirst(node);
    }


}
public class Test
{
    private static void T(params int[][] arg)
    {
        var lfu = new LFUCache(2);
        lfu.Put(1, 1);
        lfu.Put(2, 2);
        Printer.Print(lfu.Get(1));
        lfu.Put(3, 3);

        Printer.Print(lfu.Get(2));
        Printer.Print(lfu.Get(3));

        Printer.Print(lfu.Get(1));
        Printer.Print(lfu.Get(3));
        Printer.Print(lfu.Get(4));
    }

    public static void Run()
    {

        T();
    }
}