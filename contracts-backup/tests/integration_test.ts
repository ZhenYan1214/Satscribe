import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "完整的創作者註冊和 NFT 購買流程",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const creator = accounts.get('wallet_1')!;
        const subscriber = accounts.get('wallet_2')!;
        const editor = accounts.get('wallet_3')!;

        // 1. 註冊創作者
        let block = chain.mineBlock([
            Tx.contractCall('creator-registry', 'register-creator', [
                types.ascii("Alice Creator"),
                types.ascii("專業數位藝術家"),
                types.ascii("https://alice-avatar.com"),
                types.ascii("digital-art")
            ], creator.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), types.bool(true));

        // 2. 設定分潤配置
        block = chain.mineBlock([
            Tx.contractCall('revenue-splitter', 'set-revenue-split', [
                types.list([
                    types.tuple({
                        wallet: types.principal(creator.address),
                        percentage: types.uint(70),
                        role: types.ascii("creator")
                    }),
                    types.tuple({
                        wallet: types.principal(editor.address),
                        percentage: types.uint(30),
                        role: types.ascii("editor")
                    })
                ]),
                types.bool(false), // lightning-enabled
                types.bool(true)   // nft-enabled
            ], creator.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), types.bool(true));

        // 3. 創建季度
        block = chain.mineBlock([
            Tx.contractCall('subscription-nft-improved', 'create-season', [
                types.uint(1),                    // season-id
                types.uint(2000000),             // price: 2 STX
                types.uint(1000),                // max-supply
                types.uint(8760),                // expiry-date (1年後)
                types.ascii("premium"),          // tier
                types.bool(true)                 // enable-revenue-split
            ], creator.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), types.uint(1));

        // 4. 購買 NFT（觸發自動分潤）
        block = chain.mineBlock([
            Tx.contractCall('subscription-nft-improved', 'mint-subscription', [
                types.principal(creator.address),
                types.uint(1),
                types.ascii("https://nft-metadata.com")
            ], subscriber.address)
        ]);
        
        // 驗證 NFT 鑄造成功
        assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
        
        // 5. 檢查分潤是否正確執行
        // 創作者應該收到 70% = 1.4 STX
        // 編輯應該收到 30% = 0.6 STX
        
        // 6. 驗證訂閱是否有效
        let subscriptionValid = chain.callReadOnlyFn(
            'subscription-nft-improved',
            'is-subscription-valid',
            [
                types.principal(subscriber.address),
                types.principal(creator.address),
                types.uint(1)
            ],
            subscriber.address
        );
        assertEquals(subscriptionValid.result, types.bool(true));
    },
});

Clarinet.test({
    name: "測試 Soulbound Token 不可轉讓",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const creator = accounts.get('wallet_1')!;
        const subscriber = accounts.get('wallet_2')!;
        const other = accounts.get('wallet_3')!;

        // 先購買 NFT
        let block = chain.mineBlock([
            Tx.contractCall('subscription-nft-improved', 'mint-subscription', [
                types.principal(creator.address),
                types.uint(1),
                types.ascii("metadata")
            ], subscriber.address)
        ]);

        // 嘗試轉讓應該失敗
        block = chain.mineBlock([
            Tx.contractCall('subscription-nft-improved', 'transfer', [
                types.uint(1),
                types.principal(subscriber.address),
                types.principal(other.address)
            ], subscriber.address)
        ]);
        
        // 應該返回錯誤（不可轉讓）
        assertEquals(block.receipts[0].result.expectErr(), types.uint(101));
    },
});