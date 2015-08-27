function a(y,z) {        
    this.b = y;
    this.c = z;
    this.result = this.x + y + z;
    console.log("inner result: " + this.result);
}

var o = {
    "x" : 1
};

a.apply(o, [5,55]);
//a.call(o,5,55);
console.log(a.b);    // undefined
console.log("x: " + o.x);    // 1
console.log("y: " + o.b);    // 5
console.log("z: " + o.c);    // 55
console.log("x + y + z: " + o.result);    // 61
console.log(this);    

// 'bind' is just like 'call', but can build to be a function.
var foo1 = a.bind(o, 5, 55);
console.log("test7777");
foo1();
console.log("test12345");
//console.log("foo1: " + this.result);

// --------------
//console.log(b);    // undefined
a.apply(null, [5,55]);
console.log(b);    // 5

