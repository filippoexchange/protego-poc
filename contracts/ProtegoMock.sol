// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.16;

interface DsPauseLike {
    function drop(address usr, bytes32 tag, bytes calldata fax, uint256 eta) external returns (bool);
}

contract ProtegoMock {
    /// @notice riferimento al contratto "pause" (malevolo nel nostro scenario)
    address public immutable pause;

    event Deploy(address dropSpell);
    event Drop(bytes32 id);
    DsPauseLike private constant _noop = DsPauseLike(address(0));

    constructor(address _pause) {
        pause = _pause;
    }

    /**
     * @notice Vulnerable: chiama una funzione esterna dentro un flusso che può rientrare logicamente,
     *         e registra l’evento DOPO l’interazione.
     */
    function drop(address usr, bytes32 tag, bytes memory fax, uint256 eta) public {
        // **INTERACTION FIRST** (pattern sbagliato ai fini dimostrativi)
        DsPauseLike(pause).drop(usr, tag, fax, eta);

        // **EFFECTS/LOGS AFTER** (consente duplicazioni/logical reentrancy)
        emit Drop(keccak256(abi.encode(usr, tag, fax, eta)));
    }
}