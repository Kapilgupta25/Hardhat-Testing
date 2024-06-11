
import { expect } from "chai";

describe("Token contract", function() {         // SYNTAX for testing and we can remove console.log statements

    it(" Deployment should assign the total supply of tokens to the owner", async function(){

        const [owner] = await ethers.getSigners();
        console.log("Signers object: ", owner);

        const Token = await ethers.getContractFactory("Token");   // creating an instance of contract

        const hardhatToken =await Token.deploy();      // deploying our contract

        //Fetch the total supply and owner balance and checking owner balance by calling checkBalance function
        const totalSupplyPromise = hardhatToken.totalSupply();
        const ownerBalancePromise = hardhatToken.checkBalance(owner.address);

        // Wait for both promises to resolve
        const [totalSupply, ownerBalance] = await Promise.all([totalSupplyPromise, ownerBalancePromise]);

        console.log("Owner Address: ", owner.address);
        console.log("Total Supply:", totalSupply.toString());
        console.log("Owner Balance:", ownerBalance.toString());
        
        // Assert the equality of total supply and owner balance
        expect(totalSupply.toString()).to.equal(ownerBalance.toString());
    });


    it("Should transfer the tokens among different accounts", async function(){

        const [owner, address1, address2] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");   // creating an instance of contract

        const hardhatToken = await Token.deploy();      // deploying our contract

        // Transfer 10 tokens from owner to address1
        await hardhatToken.transfer(address1.address, 10);
        let address1Balance = await hardhatToken.checkBalance(address1.address);
        expect(address1Balance.toString()).to.equal('10');          // OR----> expect(address1Balance.toNumber()).to.equal(10);

        //transfer 5 tokens from address1 to address2
        await hardhatToken.connect(address1).transfer(address2.address, 5);
        let address2Balance = await hardhatToken.checkBalance(address2.address);
        expect(address2Balance.toString()).to.equal('5');            // OR ----> expect(address2Balance.toNumber()).to.equal(5);
    })
});
