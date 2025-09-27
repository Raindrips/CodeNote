import numpy as np


class AABB:
    """
    表示一个轴对齐包围盒 (Axis-Aligned Bounding Box)。
    由其最小和最大坐标定义。支持2D或3D。
    """

    def __init__(self, min_coords, max_coords):
        """
        初始化AABB。
        min_coords: NumPy 数组或列表，表示最小坐标 (e.g., [min_x, min_y] 或 [min_x, min_y, min_z])
        max_coords: NumPy 数组或列表，表示最大坐标 (e.g., [max_x, max_y] 或 [max_x, max_y, max_z])
        """
        self.min_coords = np.array(min_coords, dtype=float)
        self.max_coords = np.array(max_coords, dtype=float)
        if len(self.min_coords) != len(self.max_coords):
            raise ValueError("min_coords and max_coords must have the same dimension.")
        if np.any(self.min_coords > self.max_coords):
            raise ValueError(
                "min_coords must be less than or equal to max_coords component-wise."
            )

    def union(self, other_aabb):
        """
        计算并返回一个新的AABB，它是当前AABB和另一个AABB的并集。
        [11, 12]
        """
        new_min = np.minimum(self.min_coords, other_aabb.min_coords)
        new_max = np.maximum(self.max_coords, other_aabb.max_coords)
        return AABB(new_min, new_max)

    def intersects(self, other_aabb):
        """
        检查当前AABB是否与另一个AABB相交。
        如果它们在所有坐标轴上的投影都重叠，则相交 [2, 7]。
        """
        overlap = np.all(self.min_coords <= other_aabb.max_coords) and np.all(
            self.max_coords >= other_aabb.min_coords
        )
        return overlap

    def contains_point(self, point):
        """
        检查一个点是否在AABB内部 [7, 5]。
        """
        point_np = np.array(point, dtype=float)
        return np.all(point_np >= self.min_coords) and np.all(
            point_np <= self.max_coords
        )

    def surface_area(self):
        """
        计算AABB的表面积。仅适用于2D和3D。
        对于3D AABB，表面积为 2 * (dx*dy + dy*dz + dz*dx) [11, 23]。
        对于2D AABB，表面积为 2 * (dx + dy) (周长)。
        """
        dims = self.max_coords - self.min_coords
        if len(dims) == 2:  # 2D (周长)
            return 2 * (dims + dims[8])
        elif len(dims) == 3:  # 3D (表面积)
            return 2 * (dims * dims[8] + dims[8] * dims[9] + dims[9] * dims)
        else:
            return 0.0  # 或抛出错误，取决于需求

    def __repr__(self):
        return f"AABB(min={self.min_coords}, max={self.max_coords})"


class AABBNode:
    """
    AABB树中的节点。可以是叶节点或内部节点。
    """

    def __init__(self, aabb, is_leaf=False, object_id=None):
        self.aabb = aabb
        self.is_leaf = is_leaf
        self.object_id = object_id  # 仅用于叶节点，存储实际对象的ID或引用 [9, 1, 12]
        self.left_child = None
        self.right_child = None
        self.parent = None  # 用于动态树的更新和重新平衡 [11, 12]

    def __repr__(self):
        if self.is_leaf:
            return f"LeafNode(id={self.object_id}, aabb={self.aabb})"
        else:
            return f"InternalNode(aabb={self.aabb})"


class AABBTree:
    """
    轴对齐包围盒树 (AABB Tree)。
    一个简化的实现，用于演示基本概念。
    """

    def __init__(self):
        self.root = None
        self.nodes = []  # 存储所有节点，可以通过索引访问，用于内存优化 [22]
        self.next_node_idx = 0

    def _allocate_node(self, aabb, is_leaf=False, object_id=None):
        """
        分配一个新节点并返回其索引。
        """
        node = AABBNode(aabb, is_leaf, object_id)
        self.nodes.append(node)
        idx = self.next_node_idx
        self.next_node_idx += 1
        return idx

    def insert(self, object_aabb, object_id):
        """
        向AABB树中插入一个新对象（由其AABB和ID表示）。
        采用简化的自顶向下插入策略 [13]。
        """
        leaf_node_idx = self._allocate_node(
            object_aabb, is_leaf=True, object_id=object_id
        )
        new_leaf = self.nodes[leaf_node_idx]

        if self.root is None:
            self.root = new_leaf
            return

        # 找到最佳兄弟节点（简化：遍历到最适合的叶节点） [11]
        current_node = self.root
        while not current_node.is_leaf:
            # 决定向左还是向右子树插入
            # 简化启发式：选择导致父AABB体积增加最小的子节点 [16, 5]
            union_left_cost = current_node.left_child.aabb.union(
                object_aabb
            ).surface_area()
            union_right_cost = current_node.right_child.aabb.union(
                object_aabb
            ).surface_area()

            if union_left_cost < union_right_cost:
                current_node = current_node.left_child
            else:
                current_node = current_node.right_child

        # current_node 现在是新叶节点的最佳兄弟节点 (一个现有的叶节点)
        # 创建一个新的内部节点作为新叶节点和其兄弟节点的父节点 [11]
        old_leaf = current_node
        parent_of_old_leaf = old_leaf.parent

        new_internal_aabb = old_leaf.aabb.union(new_leaf.aabb)
        new_internal_node_idx = self._allocate_node(new_internal_aabb, is_leaf=False)
        new_internal_node = self.nodes[new_internal_node_idx]

        new_internal_node.left_child = old_leaf
        new_internal_node.right_child = new_leaf
        old_leaf.parent = new_internal_node
        new_leaf.parent = new_internal_node

        if parent_of_old_leaf is None:  # old_leaf 是根节点
            self.root = new_internal_node
        else:
            if parent_of_old_leaf.left_child == old_leaf:
                parent_of_old_leaf.left_child = new_internal_node
            else:
                parent_of_old_leaf.right_child = new_internal_node
            new_internal_node.parent = parent_of_old_leaf

        # 回溯并重新拟合祖先AABB [11]
        node_to_refit = new_internal_node.parent
        while node_to_refit:
            node_to_refit.aabb = node_to_refit.left_child.aabb.union(
                node_to_refit.right_child.aabb
            )
            # 在这里可以添加树旋转等重新平衡逻辑 [11]
            node_to_refit = node_to_refit.parent

    def query_collisions(self, query_aabb):
        """
        查询与给定AABB重叠的所有对象ID [16]。
        返回一个潜在碰撞对象ID的列表。
        """
        if self.root is None:
            return

        potential_collisions = []
        stack = [self.root]  # 使用栈进行非递归遍历

        while stack:
            current_node = stack.pop()

            if not current_node.aabb.intersects(query_aabb):
                # 如果当前节点的AABB不与查询AABB重叠，则修剪此子树 [8]
                continue

            if current_node.is_leaf:
                # 如果是叶节点且AABB重叠，则添加其对象ID
                potential_collisions.append(current_node.object_id)
            else:
                # 如果是内部节点且AABB重叠，则将子节点添加到栈中
                if current_node.left_child:
                    stack.append(current_node.left_child)
                if current_node.right_child:
                    stack.append(current_node.right_child)

        return potential_collisions

    def _print_tree(self, node, level=0, prefix="Root: "):
        """
        辅助函数：打印树结构 (用于调试)
        """
        if node is not None:
            indent = "  " * level
            if node.is_leaf:
                print(f"{indent}{prefix}{node.object_id} {node.aabb}")
            else:
                print(f"{indent}{prefix}Internal {node.aabb}")
                self._print_tree(node.left_child, level + 1, "L-- ")
                self._print_tree(node.right_child, level + 1, "R-- ")


# --- 示例用法 ---
if __name__ == "__main__":
    # 创建AABB树
    tree = AABBTree()

    # 定义一些对象及其AABB (2D)
    objects_data = [
        {"id": "ObjB", "aabb": AABB([1, 1], [3, 3])},
        {"id": "ObjC", "aabb": AABB([5, 5], [7, 7])},
        {"id": "ObjD", "aabb": AABB([0.5, 0.5], [1.5, 1.5])},  # 包含在ObjA和ObjB中
        {"id": "ObjE", "aabb": AABB([8, 8], [9, 9])},
    ]

    print("--- 插入对象到AABB树 ---")
    for obj in objects_data:
        tree.insert(obj["aabb"], obj["id"])
        print(f"插入 {obj['id']}: {obj['aabb']}")

    print("\n--- 树结构 (简化表示) ---")
    tree._print_tree(tree.root)

    print("\n--- 碰撞查询示例 ---")

    # 查询与 ObjA 重叠的区域
    query_box_1 = AABB([0.5, 0.5], [1.5, 1.5])
    print(f"\n查询与 {query_box_1} 重叠的对象:")
    collisions_1 = tree.query_collisions(query_box_1)
    print(f"潜在碰撞对象: {collisions_1}")  # 预期: ObjA, ObjB, ObjD

    # 查询与 ObjC 重叠的区域
    query_box_2 = AABB([6, 6], [8, 8])
    print(f"\n查询与 {query_box_2} 重叠的对象:")
    collisions_2 = tree.query_collisions(query_box_2)
    print(
        f"潜在碰撞对象: {collisions_2}"
    )  # 预期: ObjC, ObjE (如果ObjE的AABB足够大或与ObjC相邻)

    # 查询一个不与任何对象重叠的区域
    query_box_3 = AABB([10, 10], [11, 11])
    print(f"\n查询与 {query_box_3} 重叠的对象:")
    collisions_3 = tree.query_collisions(query_box_3)
    print(f"潜在碰撞对象: {collisions_3}")  # 预期:

    # 3D AABB 示例
    print("\n--- 3D AABB 示例 ---")
    aabb3d_1 = AABB([0, 0, 0], [1, 1, 1])
    aabb3d_2 = AABB([0.5, 0.5, 0.5], [1.5, 1.5, 1.5])
    aabb3d_3 = AABB([2, 2, 2], [3, 3, 3])

    print(f"3D AABB 1: {aabb3d_1}")
    print(f"3D AABB 2: {aabb3d_2}")
    print(f"3D AABB 3: {aabb3d_3}")

    print(f"AABB 1 和 AABB 2 是否相交? {aabb3d_1.intersects(aabb3d_2)}")  # 预期: True
    print(f"AABB 1 和 AABB 3 是否相交? {aabb3d_1.intersects(aabb3d_3)}")  # 预期: False
    print(f"AABB 1 和 AABB 2 的并集: {aabb3d_1.union(aabb3d_2)}")
    print(f"AABB 1 的表面积 (3D): {aabb3d_1.surface_area()}")  # 预期: 6.0
