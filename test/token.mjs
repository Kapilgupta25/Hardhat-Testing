import { expect } from "chai";

describe("Token Contract", function () {
    let Token;
    let hardhatToken;
    let owner;
    let address1;
    let address2;
    let addresses;
  
    beforeEach(async function () {
      Token = await ethers.getContractFactory("Token");
      [owner, address1, address2, ...addresses] = await ethers.getSigners();
      hardhatToken = await Token.deploy();
    });
  
    describe("Deployment", function () {
      it("Should set the right owner", async function () {
        expect(await hardhatToken.owner()).to.equal(owner.address);
      });
      it("Should assign the total supply of tokens to the owner", async function () {
        const totalSupplyPromise = hardhatToken.totalSupply();
        const ownerBalancePromise = hardhatToken.checkBalance(owner.address);

        const [totalSupply, ownerBalance] = await Promise.all([totalSupplyPromise, ownerBalancePromise]);

        expect(totalSupply.toString()).to.equal(ownerBalance.toString());
      });
    });


    describe("Transactions", function () {
        it("Should trasfer tokens between accounts", async function () {
          //owner account to address1.address
          await hardhatToken.transfer(address1.address, 10);
          let address1Balance = await hardhatToken.checkBalance(address1.address);
          expect(address1Balance.toString()).to.equal('10');
    
          await hardhatToken.connect(address1).transfer(address2.address, 5);
          let address2Balance = await hardhatToken.checkBalance(address2.address);
          expect(address2Balance.toString()).to.equal('5');
        });

        it("Should fail if sender does not have enough tokens", async function () {
            const initialOwnerBalance = await hardhatToken.checkBalance(owner.address); //10000
            await expect(hardhatToken.connect(address1).transfer(owner.address, 1)).to.be.revertedWith("Not Enough Tokens");
            expect(await hardhatToken.checkBalance(owner.address)).to.equal(initialOwnerBalance);
        });
    });
  });