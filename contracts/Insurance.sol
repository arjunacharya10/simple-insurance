pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Insurance {
    address private insuranceProvider;
    
    struct Entity {
        string id;
        uint256 entityType;
        uint256 premium;
    }
    
    struct Claim {
        string id;
        uint256 entityType;
        address user;
        bool isApproved;
        uint amount;
    }
    
    mapping (string => bool) private isAlreadyInsured;
    mapping(string => bool) private isClaimed;
    mapping(address => Entity[]) private addressInsured;
    mapping(address => uint256) private balances;
    mapping(string => Claim) private claims;
    Claim[] private allClaims;
    mapping(address => Claim[]) private userClaims;
    
    constructor() public{
        insuranceProvider = msg.sender;
        balances[insuranceProvider] = 0;
    }
    
    function buyInsurance(Entity memory entity) public returns (string memory){
        address buyer = msg.sender;
        if(isAlreadyInsured[entity.id] == false){
            addressInsured[buyer].push(entity);
            balances[buyer] = balances[buyer] + entity.premium / 2;
            balances[insuranceProvider] = balances[insuranceProvider] + entity.premium / 2;
            isAlreadyInsured[entity.id] = true;
            return "Success";
        }
        else{
            return "Entity already insured";
        }
    }
    
    function payPremium(uint256 amount) public {
        address payer = msg.sender;
        balances[payer] = balances[payer] + amount / 2;
        balances[insuranceProvider] = balances[insuranceProvider] + amount / 2;
    }
    
    function approveClaim(string memory claimId) public{
        claims[claimId].isApproved = true;
    }
    
    function redeemClaim(string memory claimId){
        Claim memory claim = claims[claimId];
        balances[claim.user] = 
    }
    
    
    function claimInsurance (Claim memory claim) public returns (string memory){
        if(isClaimed[claim.id] == false){
            address claimer = msg.sender;
            claims[claim.id] = claim;
            isClaimed[claim.id] = true;
            userClaims[claimer].push(claim);
            allClaims.push(claim);
            return "Success";
        }
        else{
            return "Claim has already been submitted for the product";
        }
    }
    
    function getUserBalance() public view returns (uint256){
        return balances[msg.sender];
    }
    
    
    function getTotalClaimableBalance() private view returns (uint256){
        return balances[msg.sender] *3/2;
    }
    
    function getAllClaims() public view returns(Claim[] memory){
        return allClaims;
    }
    
    function getClaimStatus(string memory claimId) public view returns (bool){
        return claims[claimId].isApproved;
    }
    
    fucntion
    
}