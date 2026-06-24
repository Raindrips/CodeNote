public class LRUCache<TKey, TValue>
{
    private readonly int capacity;
    private readonly Dictionary<TKey, LinkedListNode<(TKey key, TValue value)>> map;
    private readonly LinkedList<(TKey key, TValue value)> list;

    public LRUCache(int capacity)
    {
        this.capacity = capacity;
        map = new Dictionary<TKey, LinkedListNode<(TKey, TValue)>>(capacity);
        list = new LinkedList<(TKey, TValue)>();
    }

    public TValue Get(TKey key)
    {
        if (!map.TryGetValue(key, out var node))
            throw new KeyNotFoundException();

        // 移动到头部（最近使用）
        list.Remove(node);
        list.AddFirst(node);

        return node.Value.value;
    }

    public void Put(TKey key, TValue value)
    {
        // 如果已存在，更新并移动到头部
        if (map.TryGetValue(key, out var node))
        {
            node.Value = (key, value);
            list.Remove(node);
            list.AddFirst(node);
            return;
        }

        // 如果容量满了，删除尾部（最久未使用）
        if (map.Count >= capacity)
        {
            var last = list.Last;
            list.RemoveLast();
            map.Remove(last.Value.key);
        }

        // 插入新节点到头部
        var newNode = new LinkedListNode<(TKey, TValue)>((key, value));
        list.AddFirst(newNode);
        map[key] = newNode;
    }

    public bool TryGet(TKey key, out TValue value)
    {
        if (map.TryGetValue(key, out var node))
        {
            list.Remove(node);
            list.AddFirst(node);
            value = node.Value.value;
            return true;
        }

        value = default!;
        return false;
    }

    public TKey[] GetKeys()
    {
        return list.Select(item => item.key).ToArray();
    }
}
