import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const creator = accounts.get("wallet_1")!;
const buyer = accounts.get("wallet_2")!;
const buyer2 = accounts.get("wallet_3")!;

describe("Platform Treasury & Fee Collection Tests", () => {
  beforeEach(() => {
    // Reset simnet state before each test
  });

  it("should deploy all contracts successfully", () => {
    // Test that all contracts deploy without errors
    const deployTreasury = simnet.deployContract(
      "platform-treasury-v11",
      "platform-treasury.clar",
      { clarityVersion: 3 },
      deployer
    );
    expect(deployTreasury.result).toBeOk();

    const deployCreatorRegistry = simnet.deployContract(
      "creator-registry-v11", 
      "creator-registry.clar",
      { clarityVersion: 3 },
      deployer
    );
    expect(deployCreatorRegistry.result).toBeOk();

    const deployRevenueSplitter = simnet.deployContract(
      "revenue-splitter-v11",
      "revenue-splitter.clar", 
      { clarityVersion: 3 },
      deployer
    );
    expect(deployRevenueSplitter.result).toBeOk();

    const deploySubscriptionNFT = simnet.deployContract(
      "subscription-nft-v11",
      "subscription-nft.clar",
      { clarityVersion: 3 },
      deployer
    );
    expect(deploySubscriptionNFT.result).toBeOk();
  });

  it("should calculate platform fee correctly", () => {
    // Test platform fee calculation (1%)
    const nftPrice = 10000000; // 10 STX in microSTX
    
    const feeCalc = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "calculate-platform-fee",
      [Cl.uint(nftPrice)],
      deployer
    );
    
    expect(feeCalc.result).toBeOk();
    const result = feeCalc.result.expectOk().expectTuple();
    
    // 1% of 10 STX = 0.1 STX = 100000 microSTX
    expect(result["platform-fee"]).toBeUint(100000);
    // Creator gets 99% = 9.9 STX = 9900000 microSTX  
    expect(result["creator-amount"]).toBeUint(9900000);
  });

  it("should complete full NFT purchase flow with platform fee", () => {
    // 1. Register creator
    const registerCreator = simnet.callPublicFn(
      "creator-registry-v11",
      "register-creator",
      [
        Cl.stringAscii("Test Creator"),
        Cl.stringAscii("A test creator"),
        Cl.stringAscii("https://example.com/avatar.jpg"),
        Cl.stringAscii("tech")
      ],
      creator
    );
    expect(registerCreator.result).toBeOk();

    // 2. Set up revenue split for creator
    const revenueSplit = simnet.callPublicFn(
      "revenue-splitter-v11", 
      "set-revenue-split",
      [
        Cl.list([
          Cl.tuple({
            wallet: Cl.principal(creator),
            percentage: Cl.uint(80),
            role: Cl.stringAscii("creator")
          }),
          Cl.tuple({
            wallet: Cl.principal(deployer),
            percentage: Cl.uint(20), 
            role: Cl.stringAscii("artist")
          })
        ]),
        Cl.bool(true) // nft-enabled
      ],
      creator
    );
    expect(revenueSplit.result).toBeOk();

    // 3. Create NFT season
    const nftPrice = 10000000; // 10 STX
    const createSeason = simnet.callPublicFn(
      "subscription-nft-v11",
      "create-season",
      [
        Cl.uint(20254), // season-id
        Cl.uint(nftPrice),
        Cl.uint(9999), // max-supply
        Cl.uint(999999), // expiry-date
        Cl.stringAscii("VIP"),
        Cl.bool(true) // enable-revenue-split
      ],
      creator
    );
    expect(createSeason.result).toBeOk();

    // 4. Check initial balances
    const initialBuyerBalance = simnet.getAssetsMap().get("STX")?.get(buyer) || 0;
    const initialCreatorBalance = simnet.getAssetsMap().get("STX")?.get(creator) || 0;
    const initialPlatformBalance = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "get-platform-balance", 
      [],
      deployer
    ).result.expectUint();

    // 5. Purchase NFT (this should trigger platform fee collection)
    const purchaseNFT = simnet.callPublicFn(
      "subscription-nft-v11",
      "mint-subscription",
      [
        Cl.principal(creator),
        Cl.uint(20254),
        Cl.stringAscii("https://example.com/metadata.json")
      ],
      buyer
    );
    expect(purchaseNFT.result).toBeOk();

    // 6. Verify platform fee was collected
    const finalPlatformBalance = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "get-platform-balance",
      [],
      deployer  
    ).result.expectUint();

    const expectedPlatformFee = 100000; // 1% of 10 STX
    expect(finalPlatformBalance).toBe(initialPlatformBalance + expectedPlatformFee);

    // 7. Check platform stats
    const platformStats = simnet.callReadOnlyFn(
      "platform-treasury-v11", 
      "get-platform-stats",
      [],
      deployer
    ).result.expectOk().expectTuple();

    expect(platformStats["total-fees-collected"]).toBeUint(expectedPlatformFee);
    expect(platformStats["current-balance"]).toBeUint(expectedPlatformFee);

    // 8. Verify creator received 99% minus their revenue split
    const creatorAmountAfterPlatformFee = 9900000; // 99% of 10 STX
    const creatorShare = Math.floor(creatorAmountAfterPlatformFee * 0.8); // 80% of remaining
    
    const finalCreatorBalance = simnet.getAssetsMap().get("STX")?.get(creator) || 0;
    const expectedCreatorIncrease = creatorShare;
    
    expect(finalCreatorBalance - initialCreatorBalance).toBe(expectedCreatorIncrease);
  });

  it("should allow platform owner to withdraw fees", () => {
    // First, complete a purchase to generate platform fees
    // (Reuse setup from previous test)
    
    // Register creator and complete purchase...
    const registerCreator = simnet.callPublicFn(
      "creator-registry-v11",
      "register-creator", 
      [
        Cl.stringAscii("Test Creator"),
        Cl.stringAscii("A test creator"),
        Cl.stringAscii("https://example.com/avatar.jpg"),
        Cl.stringAscii("tech")
      ],
      creator
    );

    const createSeason = simnet.callPublicFn(
      "subscription-nft-v11",
      "create-season",
      [
        Cl.uint(20254),
        Cl.uint(10000000), // 10 STX
        Cl.uint(9999),
        Cl.uint(999999),
        Cl.stringAscii("VIP"),
        Cl.bool(false) // disable revenue split for simpler test
      ],
      creator
    );

    const purchaseNFT = simnet.callPublicFn(
      "subscription-nft-v11",
      "mint-subscription",
      [
        Cl.principal(creator),
        Cl.uint(20254),
        Cl.stringAscii("https://example.com/metadata.json")
      ],
      buyer
    );

    // Now test withdrawal
    const withdrawAmount = 50000; // 0.05 STX
    const initialDeployerBalance = simnet.getAssetsMap().get("STX")?.get(deployer) || 0;

    const withdraw = simnet.callPublicFn(
      "platform-treasury-v11",
      "withdraw-fees",
      [
        Cl.uint(withdrawAmount),
        Cl.principal(deployer)
      ],
      deployer
    );
    expect(withdraw.result).toBeOk();

    // Verify deployer received the withdrawal
    const finalDeployerBalance = simnet.getAssetsMap().get("STX")?.get(deployer) || 0;
    expect(finalDeployerBalance - initialDeployerBalance).toBe(withdrawAmount);

    // Verify platform stats updated
    const platformStats = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "get-platform-stats", 
      [],
      deployer
    ).result.expectOk().expectTuple();

    expect(platformStats["total-withdrawals"]).toBeUint(withdrawAmount);
  });

  it("should prevent non-owner from withdrawing fees", () => {
    const withdraw = simnet.callPublicFn(
      "platform-treasury-v11",
      "withdraw-fees",
      [
        Cl.uint(1000),
        Cl.principal(creator)
      ],
      creator // Non-owner trying to withdraw
    );
    expect(withdraw.result).toBeErr(Cl.uint(400)); // err-owner-only
  });

  it("should track creator contributions correctly", () => {
    // Setup and complete multiple purchases
    const registerCreator = simnet.callPublicFn(
      "creator-registry-v11",
      "register-creator",
      [
        Cl.stringAscii("Test Creator"),
        Cl.stringAscii("A test creator"), 
        Cl.stringAscii("https://example.com/avatar.jpg"),
        Cl.stringAscii("tech")
      ],
      creator
    );

    const createSeason = simnet.callPublicFn(
      "subscription-nft-v11",
      "create-season",
      [
        Cl.uint(20254),
        Cl.uint(5000000), // 5 STX
        Cl.uint(9999),
        Cl.uint(999999),
        Cl.stringAscii("VIP"),
        Cl.bool(false)
      ],
      creator
    );

    // Purchase 1
    const purchase1 = simnet.callPublicFn(
      "subscription-nft-v11",
      "mint-subscription",
      [
        Cl.principal(creator),
        Cl.uint(20254),
        Cl.stringAscii("https://example.com/metadata1.json")
      ],
      buyer
    );

    // Change season to allow multiple purchases
    const createSeason2 = simnet.callPublicFn(
      "subscription-nft-v11", 
      "create-season",
      [
        Cl.uint(20253), // Different season
        Cl.uint(3000000), // 3 STX
        Cl.uint(9999),
        Cl.uint(999999),
        Cl.stringAscii("VIP"),
        Cl.bool(false)
      ],
      creator
    );

    // Purchase 2
    const purchase2 = simnet.callPublicFn(
      "subscription-nft-v11",
      "mint-subscription",
      [
        Cl.principal(creator),
        Cl.uint(20253),
        Cl.stringAscii("https://example.com/metadata2.json")
      ],
      buyer2
    );

    // Check creator contributions
    const contributions = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "get-creator-contributions",
      [Cl.principal(creator)],
      deployer
    ).result.expectSome().expectTuple();

    // Expected: 1% of (5 STX + 3 STX) = 0.08 STX = 80000 microSTX
    expect(contributions["total-contributed"]).toBeUint(80000);
    expect(contributions["transaction-count"]).toBeUint(2);
  });
});