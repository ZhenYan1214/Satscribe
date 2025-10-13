# Stacks Libraries Reference for Claude Code

This file provides comprehensive guidance for working with Stacks blockchain libraries. Place this in your project's `.claude/` directory or reference it when working with Stacks development.

---

## Core Philosophy

When working with Stacks libraries, prioritize:
1. **Type safety** - Use TypeScript and leverage the strong typing in Stacks.js
2. **Modern APIs** - Use the latest v8+ APIs, not deprecated methods
3. **User control** - Never compromise on security or user consent
4. **Clear feedback** - Always provide transaction status and error messages
5. **Network awareness** - Respect mainnet/testnet differences

---

## @stacks/connect (v8+)

The primary library for wallet connections and user interactions.

### ✅ Modern v8 API (USE THIS)

```typescript
import { connect, request, isConnected, getLocalStorage, disconnect } from '@stacks/connect';

// Check if wallet is already connected
if (isConnected()) {
  const data = getLocalStorage();
  const stxAddresses = data?.addresses?.stx;
  const address = stxAddresses[0].address; // 'SP1...'
}

// Connect wallet
await connect();

// Get addresses from local storage (persisted)
const data = getLocalStorage();
const address = data.addresses.stx[0].address;

// Request methods (SIP-030)
const accounts = await request('stx_getAccounts');
const addresses = await request('stx_getAddresses');
const signature = await request('stx_signMessage', { message: 'Hello World' });
const txResponse = await request('stx_callContract', {
  contractAddress: 'SP...',
  contractName: 'my-contract',
  functionName: 'transfer',
  functionArgs: [...],
});

// Disconnect
disconnect();
```

### ❌ Deprecated API (DO NOT USE)

```typescript
// OLD - DO NOT USE
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
```

**Important Notes:**
- Stacks Connect v8 stores addresses in localStorage automatically
- For security, v8 only returns the current network's address (not both mainnet/testnet)
- The `request()` method is part of SIP-030 and gives explicit control
- Always check `isConnected()` on page load to restore connection state

---

## @stacks/transactions

For building and signing blockchain transactions.

### Transaction Types

```typescript
import {
  makeContractCall,
  makeSTXTokenTransfer,
  makeContractDeploy,
  AnchorMode,
  PostConditionMode,
  broadcastTransaction,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  createAssetInfo,
  bufferCV,
  intCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  tupleCV,
  listCV,
  someCV,
  noneCV,
  trueCV,
  falseCV,
  principalCV,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

// STX Transfer
const txOptions = {
  recipient: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  amount: 1000000n, // 1 STX in microstacks
  network: new StacksMainnet(),
  anchorMode: AnchorMode.Any,
  memo: 'Hello Stacks',
};

const transaction = await makeSTXTokenTransfer(txOptions);

// Contract Call
const callOptions = {
  contractAddress: 'SP000000000000000000002Q6VF78',
  contractName: 'pox-4',
  functionName: 'stack-stx',
  functionArgs: [
    uintCV(100000000), // amount-ustx
    tupleCV({
      version: bufferCV(Buffer.from([0x00])),
      hashbytes: bufferCV(Buffer.from('your-btc-address-hash', 'hex')),
    }),
    uintCV(12345), // start-burn-ht
    uintCV(12), // lock-period
  ],
  network: new StacksMainnet(),
  anchorMode: AnchorMode.Any,
  postConditionMode: PostConditionMode.Deny,
  postConditions: [
    makeStandardSTXPostCondition(
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
      FungibleConditionCode.LessEqual,
      100000000n
    ),
  ],
};

const contractCallTx = await makeContractCall(callOptions);

// Contract Deploy
const deployOptions = {
  contractName: 'my-contract',
  codeBody: '(define-public (say-hi) (ok "hello world"))',
  network: new StacksMainnet(),
  anchorMode: AnchorMode.Any,
};

const deployTx = await makeContractDeploy(deployOptions);
```

### Clarity Value (CV) Types

```typescript
// Numbers
uintCV(123);           // Unsigned integer
intCV(-123);           // Signed integer

// Strings
stringAsciiCV('hello');  // ASCII string (max 128 chars)
stringUtf8CV('hello 👋'); // UTF-8 string

// Buffers
bufferCV(Buffer.from('deadbeef', 'hex'));

// Booleans
trueCV();
falseCV();

// Optionals
someCV(uintCV(42));
noneCV();

// Principals
principalCV('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');

// Lists
listCV([uintCV(1), uintCV(2), uintCV(3)]);

// Tuples
tupleCV({
  id: uintCV(1),
  name: stringAsciiCV('Alice'),
  active: trueCV(),
});
```

### Post Conditions (Security)

Post conditions protect users by ensuring transaction outcomes match expectations.

```typescript
import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  FungibleConditionCode,
  createAssetInfo,
} from '@stacks/transactions';

// STX post condition
makeStandardSTXPostCondition(
  'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  FungibleConditionCode.LessEqual,
  1000000n // max 1 STX
);

// Fungible token post condition
makeStandardFungiblePostCondition(
  'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  FungibleConditionCode.Equal,
  100n,
  createAssetInfo(
    'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    'my-token',
    'my-token'
  )
);
```

**Post Condition Codes:**
- `Equal` - Exact amount
- `Greater` - More than amount
- `GreaterEqual` - At least amount
- `Less` - Less than amount
- `LessEqual` - At most amount

---

## @stacks/network

Network configuration for mainnet, testnet, and custom nodes.

```typescript
import { StacksMainnet, StacksTestnet, StacksMocknet } from '@stacks/network';

// Mainnet
const mainnet = new StacksMainnet();

// Testnet
const testnet = new StacksTestnet();

// Custom node
const customNetwork = new StacksMainnet({
  url: 'https://my-stacks-node.com',
});

// Check network
if (network.isMainnet()) {
  console.log('Using mainnet');
}
```

**Network URLs:**
- **Mainnet**: `https://api.mainnet.hiro.so`
- **Testnet**: `https://api.testnet.hiro.so`
- **Mocknet**: `http://localhost:3999`

---

## @stacks/stacking

For working with Stacking (PoX).

```typescript
import { StackingClient } from '@stacks/stacking';
import { StacksMainnet } from '@stacks/network';

const client = new StackingClient('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', new StacksMainnet());

// Check if can stack
const canStack = await client.canStack({
  poxAddress: 'bc1q...',
  cycles: 12,
});

// Get stacking info
const stackingInfo = await client.getStatus();

// Stack STX
const stackingTx = await client.stack({
  amountMicroStx: 100000000n,
  poxAddress: 'bc1q...',
  cycles: 12,
  burnBlockHeight: 12345,
});
```

---

## @stacks/blockchain-api-client

Type-safe API client for Stacks blockchain data.

```typescript
import { AccountsApi, TransactionsApi, SmartContractsApi, Configuration } from '@stacks/blockchain-api-client';

const config = new Configuration({
  basePath: 'https://api.mainnet.hiro.so',
});

// Get account info
const accountsApi = new AccountsApi(config);
const account = await accountsApi.getAccountBalance({
  principal: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
});

// Get transaction
const txApi = new TransactionsApi(config);
const tx = await txApi.getTransactionById({
  txId: '0x...',
});

// Call read-only function
const smartContractsApi = new SmartContractsApi(config);
const result = await smartContractsApi.callReadOnlyFunction({
  contractAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  contractName: 'my-contract',
  functionName: 'get-balance',
  readOnlyFunctionArgs: {
    sender: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    arguments: [/* CV args as hex */],
  },
});
```

---

## @stacks/encryption

For encrypting and decrypting data.

```typescript
import { encryptContent, decryptContent, getPublicKeyFromPrivate } from '@stacks/encryption';

const privateKey = 'your-private-key';
const publicKey = getPublicKeyFromPrivate(privateKey);

// Encrypt
const encrypted = await encryptContent('Hello Stacks', {
  publicKey,
});

// Decrypt
const decrypted = await decryptContent(encrypted, {
  privateKey,
});
```

---

## Common Patterns

### 1. Connect Wallet and Send Transaction

```typescript
import { connect, request, getLocalStorage } from '@stacks/connect';
import { makeContractCall, AnchorMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

// Connect
await connect();
const data = getLocalStorage();
const address = data.addresses.stx[0].address;

// Build transaction
const txOptions = {
  contractAddress: 'SP...',
  contractName: 'my-contract',
  functionName: 'my-function',
  functionArgs: [uintCV(42)],
  network: new StacksMainnet(),
  anchorMode: AnchorMode.Any,
};

// Sign and broadcast via wallet
const txResponse = await request('stx_callContract', txOptions);
console.log('Transaction ID:', txResponse.txId);
```

### 2. Read Contract State

```typescript
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const result = await callReadOnlyFunction({
  contractAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  contractName: 'my-contract',
  functionName: 'get-value',
  functionArgs: [],
  network: new StacksMainnet(),
  senderAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
});

console.log('Result:', cvToJSON(result));
```

### 3. Sign Message

```typescript
import { request } from '@stacks/connect';
import { verifyMessageSignature } from '@stacks/encryption';

// Sign
const { signature, publicKey } = await request('stx_signMessage', {
  message: 'Verify my identity',
});

// Verify
const isValid = verifyMessageSignature({
  message: 'Verify my identity',
  signature,
  publicKey,
});
```

### 4. Monitor Transaction Status

```typescript
import { TransactionsApi, Configuration } from '@stacks/blockchain-api-client';

const config = new Configuration({
  basePath: 'https://api.mainnet.hiro.so',
});

const txApi = new TransactionsApi(config);

async function waitForTransaction(txId: string) {
  let pending = true;

  while (pending) {
    const tx = await txApi.getTransactionById({ txId });

    if (tx.tx_status === 'success') {
      console.log('Transaction confirmed!');
      pending = false;
    } else if (tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition') {
      console.error('Transaction failed:', tx.tx_status);
      pending = false;
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
  }
}
```

---

## Security Best Practices

### 1. Always Use Post Conditions
```typescript
// ✅ GOOD - Protects user
const txOptions = {
  // ... other options
  postConditionMode: PostConditionMode.Deny,
  postConditions: [
    makeStandardSTXPostCondition(
      userAddress,
      FungibleConditionCode.LessEqual,
      expectedAmount
    ),
  ],
};

// ❌ BAD - Allows unexpected transfers
const txOptions = {
  // ... other options
  postConditionMode: PostConditionMode.Allow, // DANGEROUS
};
```

### 2. Validate User Input
```typescript
// ✅ GOOD
function parseSTXAmount(input: string): bigint {
  const amount = parseFloat(input);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount');
  }
  return BigInt(Math.floor(amount * 1_000_000)); // Convert to microstacks
}

// ❌ BAD
const amount = BigInt(userInput); // Can throw or produce unexpected results
```

### 3. Network Awareness
```typescript
// ✅ GOOD - Explicit network handling
const network = process.env.NETWORK === 'mainnet'
  ? new StacksMainnet()
  : new StacksTestnet();

// ❌ BAD - Hardcoded network
const network = new StacksMainnet(); // What about testing?
```

### 4. Error Handling
```typescript
// ✅ GOOD
try {
  const tx = await request('stx_callContract', txOptions);
  console.log('Success:', tx.txId);
} catch (error) {
  if (error instanceof Error) {
    console.error('Transaction failed:', error.message);
    // Show user-friendly error
  }
}

// ❌ BAD
const tx = await request('stx_callContract', txOptions); // Uncaught errors
```

---

## Common Pitfalls

### 1. Using Deprecated APIs
```typescript
// ❌ WRONG - Old API
import { AppConfig, UserSession } from '@stacks/connect';

// ✅ RIGHT - v8 API
import { connect, isConnected, getLocalStorage } from '@stacks/connect';
```

### 2. Microstacks Conversion
```typescript
// ❌ WRONG
const amount = 1; // This is 0.000001 STX!

// ✅ RIGHT
const amount = 1_000_000n; // 1 STX in microstacks
```

### 3. Ignoring Post Conditions
```typescript
// ❌ WRONG
makeContractCall({
  // ... no post conditions
  postConditionMode: PostConditionMode.Allow,
});

// ✅ RIGHT
makeContractCall({
  // ... with post conditions
  postConditionMode: PostConditionMode.Deny,
  postConditions: [/* ... */],
});
```

### 4. Not Handling Connection State
```typescript
// ❌ WRONG
<button onClick={handleConnect}>Connect Wallet</button>

// ✅ RIGHT
{isConnected() ? (
  <span>Connected: {address}</span>
) : (
  <button onClick={handleConnect}>Connect Wallet</button>
)}
```

---

## Testing

### Unit Tests with Vitest
```typescript
import { describe, it, expect } from 'vitest';
import { uintCV, intCV, tupleCV } from '@stacks/transactions';

describe('Clarity value construction', () => {
  it('creates valid tuple CV', () => {
    const tuple = tupleCV({
      id: uintCV(1),
      name: stringAsciiCV('test'),
    });

    expect(tuple.type).toBe(ClarityType.Tuple);
  });
});
```

### Integration Tests with Clarinet
```yaml
# Clarinet.toml
[project]
name = "my-project"
requirements = []
[contracts.my-contract]
path = "contracts/my-contract.clar"
```

```typescript
// my-contract.test.ts
import { Clarinet, Tx, Chain, Account } from '@hirosystems/clarinet-sdk';

Clarinet.test({
  name: "Test contract function",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall('my-contract', 'my-function', [uintCV(42)], deployer.address),
    ]);

    block.receipts[0].result.expectOk().expectUint(42);
  },
});
```

---

## Resources

### Official Documentation
- **Stacks.js**: https://github.com/hirosystems/stacks.js
- **API Reference**: https://docs.hiro.so/stacks.js
- **Connect Guide**: https://docs.hiro.so/stacks-connect
- **Blockchain API**: https://docs.hiro.so/api

### Tools
- **Clarinet**: Local development environment
- **Stacks Explorer**: https://explorer.hiro.so
- **Testnet Faucet**: https://explorer.hiro.so/sandbox/faucet

### Community
- **Discord**: https://discord.gg/stacks
- **Forum**: https://forum.stacks.org
- **GitHub**: https://github.com/stacks-network

---

## Quick Reference Card

```typescript
// Wallet Connection (v8+)
import { connect, isConnected, getLocalStorage, disconnect } from '@stacks/connect';

// Transactions
import { makeContractCall, makeSTXTokenTransfer } from '@stacks/transactions';

// Clarity Values
import { uintCV, stringAsciiCV, tupleCV, principalCV } from '@stacks/transactions';

// Network
import { StacksMainnet, StacksTestnet } from '@stacks/network';

// API Client
import { AccountsApi, TransactionsApi } from '@stacks/blockchain-api-client';

// Message Signing
import { verifyMessageSignature } from '@stacks/encryption';
```

---

**Remember**: When building with Stacks libraries, you're building on Bitcoin's security with smart contract capabilities. Always prioritize user security, clear feedback, and type safety. Trust the libraries' strong typing to catch errors early.

Built with ❤️ for the Stacks developer community.