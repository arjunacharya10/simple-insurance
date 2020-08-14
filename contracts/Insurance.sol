pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Insurance {
    address payable private owner;
    address private police;
    
    mapping(address => uint256) accumulatedPremium;

    mapping(uint256 => bool) nonce;
    mapping(address => Entity[])private insuranceInfo;
    mapping(address => mapping(uint8 => uint256)) private insurances;
    mapping(address => mapping(uint8 => bool))private hasPurchased;
    mapping(address => mapping(uint8 => uint256)) private claims;
    mapping(address => Claim[]) userClaims;
    StoreClaim[] private insuranceClaims;
    mapping(address => mapping(uint8 => bool)) private hasClaimed;
    mapping(address => mapping(uint8 => bool)) private isApproved;
    
    event ClaimNotification(address claimer, uint256 amount);
    
    constructor(address police) public {
        owner = msg.sender;
        police = police;
    }
    
    struct Entity{
        uint8 eType;
        uint256 premium;
    }
    
    struct Claim{
        uint8 eType;
        uint256 amount;
    }
    
    struct StoreClaim {
        address sender;
        uint8 eType;
        uint256 amount;
    }
    
    modifier isPolice(){
        require(msg.sender == police,"Only Police can call this function");
        _;
    }
    
    modifier isNotPolice(){
        require(msg.sender != police,"Police Cant purchase Insurance");
        _;
    }
    
    modifier isOwner(){
        require(msg.sender == owner, "Ownly owners can call this function");
        _;
    }
    
    function buyInsurance(uint8 eType, uint256 premium)
    public isNotPolice
    returns (string memory){
        require(!hasPurchased[msg.sender][eType], "Insurance Already purchased");
        insurances[msg.sender][eType] = premium;
        hasPurchased[msg.sender][eType] = true;
        insuranceInfo[msg.sender].push(Entity(eType,premium));
    }
    
    function payPremium(uint8 eType)
    public payable{
        require(hasPurchased[msg.sender][eType],"Insurance not purchased yet");
        require(msg.value >= insurances[msg.sender][eType], "Premium should be  >= premium during purchase");
        accumulatedPremium[msg.sender] = accumulatedPremium[msg.sender] +msg.value;
    }
    
    function claimInsurance(uint8 eType, uint256 amount)
    public 
    returns(string memory){
        require(hasPurchased[msg.sender][eType],"Insurance not purchased yet");
        require(accumulatedPremium[msg.sender] > amount, "Claim amount cannot exceed accumulated premium");
        if(!hasClaimed[msg.sender][eType]){
            hasClaimed[msg.sender][eType] = true;
            claims[msg.sender][eType] = amount;
            userClaims[msg.sender].push(Claim(eType,amount));
            StoreClaim memory storeClaim = StoreClaim(msg.sender,eType,amount);
            insuranceClaims.push(storeClaim);
            return "Success";
        }
        else
            return "Duplicate claim";
    }
    
    function approveInsurance(address payable claimer, uint8 eType)
    public isPolice
    returns (string memory)
    {
        require(hasClaimed[claimer][eType],"No such claim exists!");
        require(!isApproved[claimer][eType],"Claim already Approved!");
            isApproved[claimer][eType] = true;
            uint256 amount = claims[claimer][eType];
            claimer.transfer(amount * 7/10);
            address(msg.sender).transfer(amount * 1 / 10);
            delete claims[claimer][eType];
            return "Success";
    }
    
    function getClaims()
    public view isOwner
    returns (StoreClaim[] memory){
        return insuranceClaims;
    }
    
    function getUserClaims()
    public view 
    returns (Claim[] memory){
        return userClaims[msg.sender];
    }
    
    
    function getBalance()
    public view
    returns (uint256){
        return address(msg.sender).balance;
    }
    
    function closeCompany()
    public isOwner {
        selfdestruct(owner);
    }
    
    function getInsurances()
    public view 
    returns (Entity[] memory){
        return insuranceInfo[msg.sender];
    }
    
}