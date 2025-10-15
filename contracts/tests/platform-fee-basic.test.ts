import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("Platform Fee Basic Tests", () => {
  it("should calculate platform fee correctly", () => {
    // Test 1% platform fee calculation
    const nftPrice = 10000000; // 10 STX in microSTX
    
    const { result } = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "calculate-platform-fee",
      [Cl.uint(nftPrice)],
      deployer
    );
    
    expect(result).toBeOk();
    const feeData = result.expectOk().expectTuple();
    
    // 1% of 10 STX = 0.1 STX = 100000 microSTX
    expect(feeData["platform-fee"]).toBeUint(100000);
    // Creator gets 99% = 9.9 STX = 9900000 microSTX  
    expect(feeData["creator-amount"]).toBeUint(9900000);
  });

  it("should get platform fee rate info", () => {
    const { result } = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "get-platform-fee-rate",
      [],
      deployer
    );
    
    expect(result).toBeOk();
    const rateData = result.expectOk().expectTuple();
    
    expect(rateData["basis-points"]).toBeUint(100); // 1% = 100 basis points
    expect(rateData["percentage"]).toBeUint(1); // 1%
  });

  it("should have zero initial platform balance", () => {
    const { result } = simnet.callReadOnlyFn(
      "platform-treasury-v11",
      "get-platform-balance",
      [],
      deployer
    );
    
    expect(result).toBeUint(0);
  });

  it("should show correct initial platform stats", () => {
    const { result } = simnet.callReadOnlyFn(
      "platform-treasury-v11", 
      "get-platform-stats",
      [],
      deployer
    );
    
    expect(result).toBeOk();
    const stats = result.expectOk().expectTuple();
    
    expect(stats["total-fees-collected"]).toBeUint(0);
    expect(stats["total-withdrawals"]).toBeUint(0);
    expect(stats["current-balance"]).toBeUint(0);
    expect(stats["platform-fee-percentage"]).toBeUint(100); // 1% in basis points
  });
});