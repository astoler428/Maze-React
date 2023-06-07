//Disjoint Set data structure aka union find

export class UnionFind {
  array = [];

  constructor(num) {
    this.num = num;
    for (let i = 0; i < num; i++) this.array[i] = -1;
  }

  //find with path compression
  find(x) {
    if (this.array[x] < 0) return x;
    else {
      return (this.array[x] = this.find(this.array[x]));
    }
  }

  union(x, y) {
    let root1 = this.find(x);
    let root2 = this.find(y);

    if (root1 === root2) return;

    //means root2 is deeper
    if (this.array[root2] < this.array[root1]) this.array[root1] = root2;
    else {
      if (this.array[root1] === this.array[root2]) this.array[root1]--;
      this.array[root2] = root1;
    }
  }
}
