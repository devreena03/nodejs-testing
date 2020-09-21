const assert = require("assert");

//basic test structure
describe("file to be tested", () =>{
    context("functions to be tested", ()=>{
        it("should do somthing",()=>{
            console.log("test");
           assert.equal(1,2-1);
        });
        it('should test a object',()=>{
            assert.deepEqual({name:'Reena'},{name:'Reena'});
        })
        it('should be a pending test')
    })
});