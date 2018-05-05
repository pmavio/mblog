
process.on('unhandledRejection', function (err, p) {
    // console.error('catch exception:',err, p)

    // console.log(new Error(err))
    console.log(err);
});

var promise = new Promise(function(resolve, reject) {
    const i = null.length;

    resolve('ok');
    // reject(new Error("ok"));
    // throw new Error('wtf')
    // setTimeout(function() { throw new Error('test') }, 0)
});
promise.then(function(value) { console.log(value) })
    // .catch((err)=>{
    //     console.log(err)
    // })