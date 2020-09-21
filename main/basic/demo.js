exports.add = function(a,b){
    return a+b;
}

exports.addCallback = function(a,b, callback){
    setTimeout(()=>{
        return callback(null, a+b);
    },500)
}

exports.addPromise = function(a,b){
   // return Promise.reject(new Error('fake'));
    return Promise.resolve(a+b);
}

exports.foo = ()=>{
    console.log('console log called');
    console.warn('console warn called');
    return;
}

//stub createFile
exports.bar = async (fileName) => {
    await exports.createFile(fileName);
    return await callDB(fileName);
}

exports.createFile = (fileName) => {
    console.log('craete file');
    //fake create file
    return new Promise((resolve) => {
        setTimeout(()=>{
            console.log('fake file created');
            resolve('done');
        },100);
    })
}

function callDB(fileName){
    console.log('call DB');
    //fake create file
    return new Promise((resolve) => {
        setTimeout(()=>{
            console.log('fake db call');
            resolve('saved');
        },100);
    });
}

