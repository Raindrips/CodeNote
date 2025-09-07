

def passlevel_queue(root):
	if root is not None:
		myque=[]
		node=root
		myque.append(node)
		while myque:
			node=myque.pop(0)
			print(node.elem)
			if node.left is not None:
				myque.append(node.left)
			if node.right:
				myque.append(node.right)
				