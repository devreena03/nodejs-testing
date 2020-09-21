//chai
const chai = require("chai");
const expect = chai.expect;

//chai basic assertions
describe('chai test',()=>{
    it('should compare value',()=>{
        expect(1).to.equal(1);
        console.log("ENV: ",process.env.NODE_ENV);

        if(process.env.NODE_ENV=='development'){
            console.log('do somthing');
        }
    })
    it('should test some object',()=>{
        expect({name:'reena'}).to.deep.equal({name:'reena'});
        expect({name:'reena'}).to.have.property('name').to.equal('reena');
   })

    it('should test boolen flag',()=>{    
        expect(3>2).to.be.true;
        expect(3==2).to.be.false;
    })

    it('should test datatype',()=>{         
        expect({}).to.be.a('object');
        expect('some').to.be.a('string');
        expect(1).to.be.a('number');
        expect([]).to.be.a('array');
    })

    it('should test somthing',()=>{
        expect([1,2,3].length).to.equal(3);
        expect(null).to.be,null;
        expect(undefined).to.not.exist;
        expect(1).to.exist;
    })
})