const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Order = require('./order');
var sandbox = sinon.createSandbox();

describe('Order', ()=>{
    let warnstub, dateSpy, user, items, myOrder;

    beforeEach(()=>{
        warnstub = sandbox.stub(console,'warn');
        dateSpy = sandbox.spy(Date,'now');

        user = {id: 1, name:'foo'};

        items = [
            {name:'Book', price:30},
            {name:'Dice', price:20}
        ];

        myOrder = new Order(123, user, items);
    });

    afterEach(()=>{
        sandbox.restore();
    })

    context('Order constructor',()=>{
        it('should create instance of order',()=>{
            sandbox.restore();
            expect(myOrder).to.be.instanceOf(Order);
            expect(dateSpy).to.have.been.calledTwice;
            expect(myOrder).to.have.property('ref').to.equal(123);
        });

        it('should calculate shipping and total',()=>{
            expect(myOrder).to.have.property('subtotal').to.equal(50);
            expect(myOrder).to.have.property('shipping').to.equal(5);
            expect(myOrder).to.have.property('total').to.equal(55);
        });
    });

    context('Order class methods',()=>{
        it('should have methods upon creation',()=>{
            expect(myOrder.save).to.be.a('function');
            expect(myOrder.cancel).to.be.a('function');
            expect(myOrder.ship).to.be.a('function');
        });

        it('should call save method',()=>{
            expect(myOrder).to.have.property('status').to.equal('Pending');
            var o = myOrder.save();
            expect(myOrder).to.have.property('status').to.equal('Active');
        });

        it('should call cancel method',()=>{
            var result = myOrder.cancel();
            expect(myOrder).to.have.property('status').to.equal('Cancelled');
            expect(myOrder).to.have.property('shipping').to.equal(0);
            expect(myOrder).to.have.property('total').to.equal(0);
            expect(warnstub).to.have.been.calledWith('Order cancelled');
            expect(result).to.be.true;
        });

    });

    context('Order class prototype methods',()=>{
        it('should call ship method',()=>{
            myOrder.ship();
            expect(myOrder).to.have.property('status').to.equal('Shipped');
        });
    })
});