pragma solidity ^0.4.24;

import "./SubContract.sol";
import "./ParadigmBank.sol";

contract OrderGateway {

    ParadigmBank public paradigmBank;

    event DealAdded(address dealOwner, uint timestamp, address modelAddress, address desiredToken, address paymentToken);

    constructor() public {
        paradigmBank = new ParadigmBank();
    }

    function participate(address subContract, bytes32[] makerData, bytes32[] takerData) public returns (bool) {
        return SubContract(subContract).participate(makerData, takerData);
    }

    function makerDataTypes(address subContract) public view returns (string) {
        return SubContract(subContract).makerDataTypes();
    }

    function takerDataTypes(address subContract) public view returns (string) {
        return SubContract(subContract).takerDataTypes();
    }
}