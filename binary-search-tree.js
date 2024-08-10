class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        if (array === undefined)
            throw new Error('Enter an array');
        this.array = array.sort((a, b) => a - b);
        this.array = [... new Set(this.array)];
        this.root = this.buildTree(this.array);
    }

    buildTree(array) {
        if (array.length < 1) {
            return null;
        }

        let mid = Math.floor(array.length / 2);
        let node = new Node(array[mid]);

        node.left = this.buildTree(array.slice(0, mid));
        node.right = this.buildTree(array.slice(mid + 1));

        return node;
    }

    prettyPrint(node = this.root, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    }

    insetToArray(value) {
        this.array.push(value);
        this.array.sort((a, b) => a - b);
    }

    insert(value, node = this.root) {
        if (this.root === null) {
            this.root = new Node(value);
            this.array.push(value);
            return;
        }

        if (this.array.includes(value)) {
            return;
        }

        if (value < node.data) {
            if (node.left === null) {
                node.left = new Node(value);
                this.insetToArray(value);

            } else {
                this.insert(value, node.left);
            }
        } else {
            if (node.right === null) {
                node.right = new Node(value);
                this.insetToArray(value);

            } else {
                this.insert(value, node.right);
            }
        }


    }

    deleteItem(value, node = this.root) {
        if (node === null) {
            return null;
        }
        if (!(this.array.includes(value))) {
            console.log("No such value is found");
            return;
        }
        else if (value < node.data)
            node.left = this.deleteItem(value, node.left);
        else if (value > node.data)
            node.right = this.deleteItem(value, node.right);
        else {
            if (node.right === null && node.left === null)
                node = null;

            else if (node.left === null)
                node = node.right;

            else if (node.right === null)
                node = node.left;

            else {
                const successor = this.#getSuccessor(node);
                node.data = successor.data;
                node.right = this.deleteItem(successor.data, node.right);
            }
            this.array.splice(this.array.indexOf(value), 1);
        }
        return node;
    }

    find(value, node = this.root) {
        if (node === null) {
            return null;
        }

        if (!(this.array.includes(value))) {
            console.log("No such value is found");
            return;
        }

        if (value < node.data) {
            return this.find(value, node.left);
        } else if (value > node.data) {
            return this.find(value, node.right);
        } else {
            return node;
        }
    }

    levelOrder(callback) {
        if (callback === undefined)
            throw new Error("Please provide a callback")

        if (this.root === null)
            return;

        const levelOrderList = [];
        const queue = [this.root];
        while (queue.length > 0) {

            const currentNode = queue.shift();
            if (currentNode.left !== null)
                queue.push(currentNode.left);
            if (currentNode.right !== null)
                queue.push(currentNode.right);

            levelOrderList.push(callback(currentNode.data));

        }
        return levelOrderList;
    }

    inOrder(callback, node = this.root, inOrderList = []) {
        if (callback === undefined)
            throw new Error("Please provide a callback");
        if (node === null) {
            return;
        }

        this.inOrder(callback, node.left, inOrderList);
        inOrderList.push(callback(node.data));
        this.inOrder(callback, node.right, inOrderList);

        if (inOrderList.length > 0)
            return inOrderList;

    }

    preOrder(callback, node = this.root, preOderList = []) {
        if (callback === undefined)
            throw new Error("Please provide a callback");
        if (node === null) {
            return;
        }
        preOderList.push(callback(node.data));
        this.preOrder(callback, node.left, preOderList);
        this.preOrder(callback, node.right, preOderList);

        if (preOderList.length > 0) {
            return preOderList;
        }
    }

    postOrder(callback, node = this.root, postOrderList = []) {
        if (callback === undefined)
            throw new Error("Enter a callback");
        if (node === null)
            return;

        this.postOrder(callback, node.left, postOrderList);
        this.postOrder(callback, node.right, postOrderList);
        postOrderList.push(callback(node.data));

        if (postOrderList.length > 0)
            return postOrderList;
    }

    height(node = this.root) {

        if (node === null)
            return 0;

        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(value, node = this.root, counter = 0) {
        if (node === null)
            return;

        if (value === node.data)
            return counter;

        if (value > node.data)
            return this.depth(value, node.right, counter + 1);
        else
            return this.depth(value, node.left, counter + 1);

    }

    isBalanced() {
        const left = this.height(this.root.left);
        const right = this.height(this.root.right);

        if (left === right || left + 1 === right || right + 1 === left)
            return true;
        return false;
    }

    reBalance() {
        this.root = this.buildTree(this.array);
    }

    #getSuccessor(node) {
        let curr = node.right;
        while (curr !== null && curr.left !== null) {
            curr = curr.left;
        }
        return curr;
    }

}

function randomArray(arraySize) {
    const array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 98 + 1));
    }

    return array;
}

const array = randomArray(8);

const tree = new Tree(array);

console.log(`is Tree balanced ? ${tree.isBalanced()}`);

console.log("Tree elements in levelOrder");

let levelOrder;
let preOrder;
let postOrder;
let inOrder;

levelOrder = tree.levelOrder((data) => { return data });
console.log(levelOrder.join(' -> '));

console.log("Tree elements in preOrder");

preOrder = tree.preOrder((data) => { return data });
console.log(preOrder.join(' -> '))

console.log("Tree elements in postOrder");

postOrder = tree.postOrder((data) => { return data });
console.log(postOrder.join(' -> '))

console.log("Tree elements in inOrder");

inOrder = tree.inOrder((data) => { return data });
console.log(inOrder.join(' -> '));

tree.insert(10);
tree.insert(45);
tree.insert(87);
tree.insert(19);

console.log(`is Tree balanced ? ${tree.isBalanced()}`);

tree.reBalance();

console.log(`is Tree balanced ? ${tree.isBalanced()}`);

levelOrder = tree.levelOrder((data) => { return data });
console.log(levelOrder.join(' -> '));

console.log("Tree elements in preOrder");

preOrder = tree.preOrder((data) => { return data });
console.log(preOrder.join(' -> '))

console.log("Tree elements in postOrder");

postOrder = tree.postOrder((data) => { return data });
console.log(postOrder.join(' -> '))

console.log("Tree elements in inOrder");

inOrder = tree.inOrder((data) => { return data });
console.log(inOrder.join(' -> '));

tree.prettyPrint();
