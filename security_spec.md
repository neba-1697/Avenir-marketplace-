# Avenir Core Security Specification & ABAC Policies

Designed by Nebil Shebab, Full-Stack Developer.

---

## 1. Core Data Invariants
- **Identity Integrity**: Users can never register accounts under a hijacked credential (the document ID must strictly match the authenticated user's UID: `request.auth.uid`).
- **Role Isolation**: Standard client SDK callers cannot alter critical privilege arrays, such as elevation to `userType: 'admin'`. Only server actions or pre-validated admin gates allow privilege configuration.
- **Strict Keys**: Document creation mandates matching the exact schemas mapped in `firebase-blueprint.json` to prevent key poisoning or field hijacking.
- **Escrow Solvency**: Standard buyers can only transitional state fields in orders that they owner-bind (such as confirming delivery). Status elevation to `Inspection Approved` is restricted to authorized `inspector` roles.
- **Immutable Timestamps**: System temporal structures such as `createdAt` must strictly bind to `request.time`.

---

## 2. The "Dirty Dozen" Threat Payloads (Targeting Escalations & Forgeries)

1. **User Identity Takeover Attempt**  
   - *Target*: Creation of `/users/user_victim_id` by user with UID `user_attacker_id`.  
   - *Expected Result*: `PERMISSION_DENIED`

2. **Self-Admin Privilege Escalation**  
   - *Target*: Update `userType` to `'admin'` inside `/users/user_attacker_id`.  
   - *Expected Result*: `PERMISSION_DENIED`

3. **Spoofed Seller Verification Creation**  
   - *Target*: Creating `/seller_verifications/sv_hijack` with `verificationStatus: 'approved'` directly from client.  
   - *Expected Result*: `PERMISSION_DENIED`

4. **Unauthorized Store Takeover**  
   - *Target*: Update `/stores/store-bole-elec` to replace `ownerId` with `attacker_uid`.  
   - *Expected Result*: `PERMISSION_DENIED`

5. **Direct Listing Bypassing Verification**  
   - *Target*: Creating `/products/prod-new` directly with `status: 'active'` or `verificationStatus: 'verified'` circumventing quality checks.  
   - *Expected Result*: `PERMISSION_DENIED`

6. **Malicious Order Pricing Manipulation**  
   - *Target*: Attempting to change `totalAmount` of existing locked order `/orders/ord_551` to `100` cents (1 ETB).  
   - *Expected Result*: `PERMISSION_DENIED`

7. **Escrow Hijacking (Skip Inspection)**  
   - *Target*: Transitioning order status directly to `Inspection Approved` as a standard buyer user.  
   - *Expected Result*: `PERMISSION_DENIED`

8. **Direct Escrow Release Sabotage**  
   - *Target*: Mutating `/orders/ord_551/payment.status` to `released_to_seller` before delivery confirmation.  
   - *Expected Result*: `PERMISSION_DENIED`

9. **Foreign PII Data Reading (Harvesting)**  
   - *Target*: Querying the entire `/users` profile collection without owner matches or filter guards.  
   - *Expected Result*: `PERMISSION_DENIED`

10. **Shadow Field Injection**  
    - *Target*: Creating `/users/attacker_uid` with unregistered field `attackerCredentialToken`.  
    - *Expected Result*: `PERMISSION_DENIED`

11. **Immortality Field Modification**  
    - *Target*: Mutating `createdAt` timestamp of a document after creation.  
    - *Expected Result*: `PERMISSION_DENIED`

12. **Orphaned Escrow Entry Creation**  
    - *Target*: Registering an escrow transaction `/escrow_transactions/txn_991` that points to a non-existent order.  
    - *Expected Result*: `PERMISSION_DENIED`

---

## 3. Threat Simulator Draft
*(This represents the TDD structure to run inside safe environments)*
```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Avenir Fortress Security Policies', () => {
  it('prevents attacker from creating a profile with different UID', async () => {
    const db = await getDbInstance({ uid: 'attacker_uid' });
    await assertFails(db.doc('users/victim_uid').set({
      id: 'victim_uid',
      email: 'victim@email.com',
      firstName: 'Victim',
      lastName: 'A',
      userType: 'buyer'
    }));
  });
});
```
