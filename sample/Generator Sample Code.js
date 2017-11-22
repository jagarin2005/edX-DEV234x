function run(genFunc) {
  const genObj = genFunc();
  
  function iterate(iteration) {
    if( iteration.done ) 
      return Promise.resolve(iteration.value);
    return Promise.resolve(iteration.value)
      .then( x => iterate(genObj.next(x)))
      .catch( x => iterate(genObj.throw(x)))
  }
  
  try {
    return iterate(genObj.next());
  } catch( ex ) {
    return Promise.reject(ex);
  }
}

function *gen() {
  var post1Stream = yield fetch("https://jsonplaceholder.typicode.com/posts/1");
  var post1 = yield post1Stream.json();
  console.log(post1.title);
  
  var post2Stream = yield fetch("https://jsonplaceholder.typicode.com/posts/2");
  var post2 = yield post2Stream.json();
  console.log(post2.title);
  
  var number = yield 12345;
  console.log(number);
  
  var string = yield "abc";
  console.log(string);
  
  var obj = yield {id: 123, name: "Name"};
  console.log(obj);
  
  var a = yield 54434337746;
  console.log(a);
  return "done";
  
}

run(gen).then(x => console.log(x))
        .catch(x => console.log(x.message));