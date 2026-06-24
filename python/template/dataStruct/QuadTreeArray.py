class QuadTreeArray:
    def __init__(self, max_depth=4):
        if not isinstance(max_depth, int) or max_depth < 0:
            raise ValueError("最大深度必须是非负整数。")
        self.max_depth = max_depth
        self.array_length = self._calculate_array_length()
        # 初始化一个足够大的列表来存储节点数据，初始为None
        self.tree_array = [None] * self.array_length
        print(f"四叉树最大深度: {self.max_depth}")
        print(f"计算出的数组长度: {self.array_length}")

    def _calculate_array_length(self):
        """
        根据最大深度计算所需的数组长度。
        """
        # 如果深度为 -1 (例如，空树)，长度为 0。但通常深度从 0 开始。
        if self.max_depth == -1:
            return 0
        
        # 使用等比数列求和公式
        # sum = (r^(n+1) - 1) / (r - 1)
        # r = 4 (每个节点有4个子节点)
        # n = max_depth (从深度 0 到 max_depth，共有 max_depth + 1 层)
        return (4**(self.max_depth + 1) - 1) // 3

    def get_node_index(self, parent_index, child_position):
        """
        根据父节点索引和子节点位置（0-3，分别代表 NW, NE, SW, SE）
        计算子节点的数组索引。
        """
        if not 0 <= child_position <= 3:
            raise ValueError("子节点位置必须在 0 到 3 之间。")
        return 4 * parent_index + 1 + child_position

    def set_node_data(self, index, data):
        """
        设置特定索引处的节点数据。
        """
        if 0 <= index < self.array_length:
            self.tree_array[index] = data
        else:
            print(f"索引 {index} 超出数组范围。")

    def get_node_data(self, index):
        """
        获取特定索引处的节点数据。
        """
        if 0 <= index < self.array_length:
            return self.tree_array[index]
        else:
            print(f"索引 {index} 超出数组范围。")
            return None

    def print_tree_structure(self, current_index=0, current_depth=0, prefix=""):
        """
        递归地打印四叉树的结构和数据（仅用于演示）。
        """
        if current_index >= self.array_length or current_depth > self.max_depth:
            return

        node_data = self.get_node_data(current_index)
        print(f"{prefix}深度 {current_depth}, 索引 {current_index}: {node_data}")

        if current_depth < self.max_depth:
            # 递归打印四个子节点
            child_positions = ["NW", "NE", "SW", "SE"]
            for i, pos_name in enumerate(child_positions):
                child_index = self.get_node_index(current_index, i)
                self.print_tree_structure(child_index, current_depth + 1, prefix + "  ")

# --- 使用示例 ---
if __name__ == "__main__":
    # 创建一个深度为 4 的四叉树实例
    quadtree = QuadTreeArray(max_depth=4)

    # 设置一些节点数据
    quadtree.set_node_data(0, "Root Node (Depth 0)") # 根节点
    quadtree.set_node_data(1, "NW Child of Root (Depth 1)") # 根节点的西北子节点
    quadtree.set_node_data(2, "NE Child of Root (Depth 1)") # 根节点的东北子节点

    # 设置深度为 2 的节点数据 (NW Child of NW Child)
    # 根节点NW子节点的索引是 1
    # 它的NW子节点索引是 4*1 + 1 = 5
    quadtree.set_node_data(quadtree.get_node_index(1, 0), "NW Child of NW Child (Depth 2)")
    quadtree.set_node_data(quadtree.get_node_index(1, 1), "NE Child of NW Child (Depth 2)")

    # 尝试获取节点数据
    print("\n--- 获取节点数据示例 ---")
    print(f"根节点数据: {quadtree.get_node_data(0)}")
    print(f"索引 1 的数据: {quadtree.get_node_data(1)}")
    print(f"索引 2 的数据: {quadtree.get_node_data(2)}")
    print(f"索引 5 的数据: {quadtree.get_node_data(5)}")
    print(f"索引 6 的数据: {quadtree.get_node_data(6)}")
    print(f"索引 100 的数据: {quadtree.get_node_data(100)}") # 尚未设置的数据

    print("\n--- 打印四叉树结构（部分，仅演示）---")
    # 注意：如果树很大，完整打印会很长
    # 只打印部分深度以避免输出过长
    print("（由于树可能很大，仅打印前几层以供演示）")
    # 为了避免输出过长，我们可以修改 print_tree_structure 来限制打印的深度
    # 或者只打印到某个特定的索引
    # 此处为方便演示，我将 QuadtreeArray 类的 print_tree_structure 方法稍作修改以展示
    # 完整的打印可能会非常庞大，因为即使是深度4的树也有341个节点
    # 以下手动调用根节点的四个子节点，并限制每个子节点只打印其直接子节点
    
    # 打印根节点及其第一层子节点
    quadtree.print_tree_structure(current_index=0, current_depth=0, prefix="")