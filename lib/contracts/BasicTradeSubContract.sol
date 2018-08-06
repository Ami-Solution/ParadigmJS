pragma solidity ^0.4.24;

import "./SubContract.sol";
import "./SignatureVerification.sol";
import "./Token.sol";

contract BasicTradeSubContract is SubContract, SignatureVerification {

    mapping(bytes32 => uint) bought;

    constructor(address _paradigmBank, string _makerDataTypes, string _takerDataTypes) {
      paradigmBank = ParadigmBank(_paradigmBank);
        makerDataTypes = _makerDataTypes;
        takerDataTypes = _takerDataTypes;
    }

    function participate(bytes32[] makerData, bytes32[] takerData) public returns (bool) {
      // 1. Standard validation
      require(verify(makerData));

      // 2. Contract specific validation
      uint signerTokenCount = uint(makerData[2]);
      uint signerTokenCountToTake = uint(takerData[0]);
      require(bought[getOrderHash(makerData)] + signerTokenCountToTake < signerTokenCount);

        // transfer a -> b
        require(sendMaker(makerData, takerData));
        // transfer b -> a
        require(sendTaker(makerData, takerData));

      return true;
    }

    function getOrderHash(bytes32[] makerData) returns (bytes32) {
      address signerToken = address(makerData[1]);
      uint signerTokenCount = uint(makerData[2]);
      address buyer = address(makerData[3]);
      address buyerToken = address(makerData[4]);
      uint buyerTokenCount = uint(makerData[5]);
      return keccak256(getSigner(makerData), signerToken, signerTokenCount, buyer, buyerToken, buyerTokenCount);
    }

    function sendMaker(bytes32[] makerData, bytes32[] takerData) returns (bool) {
        return paradigmBank.transferFromSignature(
            address(makerData[1]),
            address(makerData[0]),
            address(makerData[3]), //TODO: how do we get the taker address?  data[3]?
            uint(takerData[0]),
            address(makerData[6]),
            uint (makerData[7]),
            uint8(makerData[8]),
            bytes32(makerData[9]),
            bytes32(makerData[10]),
            uint(makerData[11])
        );
    }

    function sendTaker(bytes32[] makerData, bytes32[] takerData) returns (bool) {
        uint tokensTakerCount = ratioFor(uint(makerData[5]), uint(takerData[0]), uint(makerData[2]));

        return paradigmBank.transferFromSignature(
            address(makerData[4]),
            address(makerData[3]),
            address(makerData[0]),
            uint(tokensTakerCount),
            address(takerData[1]),
            uint (takerData[2]),
            uint8(takerData[3]),
            bytes32(takerData[4]),
            bytes32(takerData[5]),
            uint(takerData[6])
        );
    }
}
