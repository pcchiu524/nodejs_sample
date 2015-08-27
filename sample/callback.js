function do_a( callback ){
  setTimeout( function(){
    // simulate a time consuming function
    console.log( '`do_a`: this takes longer than `do_b`' );
 
    // if callback exist execute it
    callback && callback();
  }, 3000 );
}
 
function do_b(){
  console.log( '`do_b`: now we can make sure `do_b` comes out after `do_a`' );
}
 
do_a( function(){
  do_b();
});
