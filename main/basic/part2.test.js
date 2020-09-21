const assert = require("assert");

//before and after
describe("file to be tested", () =>{
    context("functions to be tested", ()=>{
        before(()=>{
            console.log("========before=========");
        });
        after(()=>{
            console.log("========after=========");
        });
        beforeEach(()=>{
            console.log("========beforeEach=========");
        });
        afterEach(()=>{
            console.log("========afterEach=========");
        });
        it("should do somthing",()=>{
           assert.equal(1,2-1);
        });
        it('should test a object',()=>{
            assert.deepEqual({name:'Reena'},{name:'Reena'});
        })
        it('should be a pending test')
    })
});