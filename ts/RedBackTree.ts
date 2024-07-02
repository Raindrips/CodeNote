enum Color {
    RED,
    BLACK,
}
class TreeNode {
    key: number;
    color: Color;
    left: TreeNode | null;
    right: TreeNode | null;
    parent: TreeNode | null;
    constructor(key: number, color: Color) {
        this.key = key;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}
class RedBlackTree {
    root: TreeNode | null = null;
    private leftRotate(x: TreeNode) {
        const y = x.right!;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;
        if (!x.parent) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }
    private rightRotate(x: TreeNode) {
        const y = x.left!;
        x.left = y.right;
        if (y.right) y.right.parent = x;
        y.parent = x.parent;
        if (!x.parent) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
        y.right = x;
        x.parent = y;
    }
    private insertFixUp(z: TreeNode) {
        while (z.parent && z.parent.color === Color.RED) {
            if (z.parent === z.parent.parent!.left) {
                const y = z.parent.parent!.right;
                if (y && y.color === Color.RED) {
                    z.parent.color = Color.BLACK;
                    y.color = Color.BLACK;
                    z.parent.parent!.color = Color.RED;
                    z = z.parent.parent!;
                } else {
                    if (z === z.parent.right) {
                        z = z.parent;
                        this.leftRotate(z);
                    }

                    z.parent!.color = Color.BLACK;
                    z.parent!.parent!.color = Color.RED;
                    this.rightRotate(z.parent!.parent!);
                }
            } else {
                const y = z.parent.parent!.left;
                if (y && y.color === Color.RED) {
                    z.parent.color = Color.BLACK;
                    y.color = Color.BLACK;
                    z.parent.parent!.color = Color.RED;
                    z = z.parent.parent!;
                } else {
                    if (z === z.parent.left) {
                        z = z.parent;
                        this.rightRotate(z);
                    }

                    z.parent!.color = Color.BLACK;
                    z.parent!.parent!.color = Color.RED;
                    this.leftRotate(z.parent!.parent!);
                }
            }
        }

        this.root!.color = Color.BLACK;
    }
    
    insert(key: number) {
        let z = new TreeNode(key, Color.RED);
        let y: TreeNode | null = null;
        let x = this.root;
        while (x !== null) {
            y = x;
            if (z.key < x.key) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
        z.parent = y;
        if (y === null) {
            this.root = z;
        } else if (z.key < y.key) {
            y.left = z;
        } else {
            y.right = z;
        }
        this.insertFixUp(z);
    }

    private deleteFixup(x: TreeNode | null) {

        while (x !== this.root && (!x || x.color === Color.BLACK)) {
            if (x == null || x.parent == null) { return }
            if (x === x.parent?.left) {
                let w = x.parent.right;
                if (w?.color === Color.RED) {
                    w.color = Color.BLACK;
                    x.parent.color = Color.RED;
                    this.leftRotate(x.parent);
                    w = x.parent.right;
                }
                if ((!w?.left || w.left.color === Color.BLACK) && (!w?.right || w.right.color === Color.BLACK)) {
                    w!.color = Color.RED;
                    x = x.parent;
                } else {
                    if (!w?.right || w.right.color === Color.BLACK) {
                        w!.left!.color = Color.BLACK;
                        w!.color = Color.RED;
                        this.rightRotate(w);
                        w = x.parent.right;
                    }
                    w!.color = x.parent.color;
                    x.parent.color = Color.BLACK;
                    w!.right!.color = Color.BLACK;
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                let w = x.parent?.left;
                if (w?.color === Color.RED) {
                    w.color = Color.BLACK;
                    x.parent.color = Color.RED;
                    this.rightRotate(x.parent);
                    w = x.parent.left;
                }
                if ((!w?.left || w.left.color === Color.BLACK) && (!w?.right || w.right.color === Color.BLACK)) {
                    w!.color = Color.RED;
                    x = x.parent;
                } else {
                    if (!w?.left || w.left.color === Color.BLACK) {
                        w!.right!.color = Color.BLACK;
                        w!.color = Color.RED;
                        this.leftRotate(w);
                        w = x.parent.left;
                    }
                    w!.color = x.parent.color;
                    x.parent.color = Color.BLACK;
                    w!.left!.color = Color.BLACK;
                    this.rightRotate(x.parent);
                    x = this.root;
                }
            }
        }
        if (x) x.color = Color.BLACK;
    }

    delete(key: number) {
        let z = this.root;
        while (z && z.key !== key) {
            if (key < z.key) {
                z = z.left;
            } else {
                z = z.right;
            }
        }
        if (!z) return;

        let y = z;
        let yOriginalColor = y.color;
        let x: TreeNode | null;
        if (!z.left) {
            x = z.right;
            this.transplant(z, z.right);
        } else if (!z.right) {
            x = z.left;
            this.transplant(z, z.left);
        } else {
            y = this.minimum(z.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent === z) {
                if (x) x.parent = y;
            } else {
                this.transplant(y, y.right);
                y.right = z.right;
                if (y.right) y.right.parent = y;
            }
            this.transplant(z, y);
            y.left = z.left;
            if (y.left) y.left.parent = y;
            y.color = z.color;
        }
        if (yOriginalColor === Color.BLACK) {
            this.deleteFixup(x);
        }
    }

    private minimum(node: TreeNode): TreeNode {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    private transplant(u: TreeNode, v: TreeNode | null) {
        if (!u.parent) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v) v.parent = u.parent;
    }
}


function levelOrderTraversal(root:TreeNode) {
    if (!root) return [];
  
    const result = [];
    const queue = [root];
  
    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel = [];
  
      for (let i = 0; i < levelSize; i++) {
        const currentNode = queue.shift()!;
        currentLevel.push(currentNode.key);
  
        if (currentNode.left) queue.push(currentNode.left);
        if (currentNode.right) queue.push(currentNode.right);
      }
  
      result.push(currentLevel);
    }
  
    return result;
  }