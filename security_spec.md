# Security Specification - VoteEase Protocol

## 1. Data Invariants
- A User profile must always have a `uid` matching their authenticated ID.
- `isVerified` can only transition from `false` to `true`.
- `votedElections` is an array of election IDs; each must exist in the `elections` collection.
- A `Vote` record's ID must be `${electionId}_${userId}` to enforce one-vote-per-election.
- Only verified users can create `Vote` records.
- Elections are publicly readable by signed-in users but only writable by administrators.

## 2. The "Dirty Dozen" Payloads (Red Team Plan)

1. **Identity Theft**: Attempt to create a user profile with a `uid` that does not match `request.auth.uid`.
2. **Shadow Field Injection**: Attempt to update a user profile with a `isAdmin: true` field.
3. **Double Voting**: Attempt to create a second vote for the same election (bypassing ID convention).
4. **Unverified Ballot**: Attempt to vote as a user whose `isVerified` property is `false`.
5. **Expired Ballot**: Attempt to vote in an election whose status is `ended`.
6. **Self-Verification**: Attempt to set `isVerified: true` without going through the protocol (if strictness was possible, here we allow it for prototype but validate types).
7. **Orphaned Vote**: Attempt to vote in an election that does not exist.
8. **Malicious ID Poisoning**: Attempt to create a document with a 1MB string as an ID.
9. **Relational PII Leak**: Attempt to list all user profiles (PII isolation check).
10. **State Shortcut**: Attempt to set an election status directly to `ended` as a regular voter.
11. **Massive Payload**: Attempt to save a 2MB biography string.
12. **Timestamp Spoofing**: Attempt to set a `timestamp` in the future for a vote.

## 3. The Test Runner Structure
The `firestore.rules.test.ts` will verify these rejections using the Firebase Emulators or logic checks.
