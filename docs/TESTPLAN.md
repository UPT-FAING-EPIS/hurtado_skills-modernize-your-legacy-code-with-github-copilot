# COBOL Account Management System - Test Plan

**Document Version:** 1.0  
**Date Created:** April 8, 2026  
**System Under Test (SUT):** COBOL Account Management System  
**Scope:** Student Account Balance Management  
**Created For:** Business Stakeholder Validation & Node.js App Modernization

---

## Test Plan Overview

This test plan documents all test cases for the COBOL Account Management System, covering:
- Menu navigation and user input validation
- Balance inquiry operations
- Credit (deposit) transactions
- Debit (withdrawal) transactions with validation
- Insufficient funds handling
- Program lifecycle
- Error handling and edge cases

---

## Test Cases

### Navigation & System Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | System displays main menu on startup | System is compiled and executable | 1. Execute the application | Menu displays with options 1-4 (View Balance, Credit Account, Debit Account, Exit) | | | |
| TC-02 | Menu displays correct text labels | System is running | 1. Observe initial menu display | Menu shows: "1. View Balance", "2. Credit Account", "3. Debit Account", "4. Exit" | | | |
| TC-03 | System loops back to menu after operation | System is running and menu is displayed | 1. Select option 1 (View Balance) 2. Observe system behavior | System redisplays menu after operation completes | | | |
| TC-04 | System exits on option 4 | System is running and menu is displayed | 1. Select option 4 2. Observe program execution | System displays "Exiting the program. Goodbye!" and terminates | | | |
| TC-05 | Invalid menu choice validation (option 0) | Menu is displayed | 1. Enter 0 as menu choice | System displays "Invalid choice, please select 1-4." and redisplays menu | | | |
| TC-06 | Invalid menu choice validation (option 5) | Menu is displayed | 1. Enter 5 as menu choice | System displays "Invalid choice, please select 1-4." and redisplays menu | | | |
| TC-07 | Invalid menu choice validation (non-numeric) | Menu is displayed | 1. Enter "A" as menu choice | System handles input gracefully and prompts for valid input or displays error | | | Default COBOL behavior - may vary |

---

### View Balance Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-08 | View initial balance | System is running, no transactions performed | 1. Select option 1 (View Balance) | System displays "Current balance: 001000.00" | | | Initial balance = 1000.00 |
| TC-09 | View balance after single credit | System is running, balance is 1000.00 | 1. Credit 500.00 to account 2. Select option 1 | System displays "Current balance: 001500.00" | | | Balance = 1000.00 + 500.00 |
| TC-10 | View balance after single debit | System is running, balance is 1000.00 | 1. Debit 300.00 from account 2. Select option 1 | System displays "Current balance: 000700.00" | | | Balance = 1000.00 - 300.00 |
| TC-11 | View balance after multiple transactions | System is running with mixed transactions | 1. Credit 500.00 2. Debit 200.00 3. Credit 100.00 4. Select option 1 | System displays correct final balance: 001400.00 | | | Balance = 1000 + 500 - 200 + 100 |
| TC-12 | View balance does not modify account | System is running, balance is 1000.00 | 1. Select option 1 (View Balance) 2. Select option 1 again | Both displays show same balance 001000.00 | | | Read-only operation |

---

### Credit Account Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-13 | Credit with positive amount (small) | System is running, balance is 1000.00 | 1. Select option 2 2. Enter 10.00 | System displays "Amount credited. New balance: 001010.00" | | | Balance increased by 10.00 |
| TC-14 | Credit with positive amount (large) | System is running, balance is 1000.00 | 1. Select option 2 2. Enter 5000.00 | System displays "Amount credited. New balance: 006000.00" | | | Balance increased by 5000.00 |
| TC-15 | Credit maximum allowed amount | System is running, balance is 1000.00 | 1. Select option 2 2. Enter 999999.99 | System displays "Amount credited. New balance: 1000000.99" | | | Tests upper limit of PIC 9(6)V99 |
| TC-16 | Credit with decimal amount | System is running, balance is 1000.00 | 1. Select option 2 2. Enter 123.45 | System displays "Amount credited. New balance: 001123.45" | | | Handles decimal values correctly |
| TC-17 | Multiple sequential credits | System is running, balance is 1000.00 | 1. Credit 100.00 2. Credit 200.00 3. Credit 300.00 | Each transaction succeeds. Final balance: 001600.00 | | | Cumulative credit operations |
| TC-18 | Credit preserves decimal precision | System is running | 1. Credit 0.01 2. Credit 0.02 3. View balance | Balance reflects exact decimal values: 001000.03 | | | Accounting accuracy |
| TC-19 | Credit zero amount | System is running, balance is 1000.00 | 1. Select option 2 2. Enter 0 | System displays "Amount credited. New balance: 001000.00" | | | Zero credit allowed |

---

### Debit Account Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-20 | Debit with sufficient funds (small amount) | System is running, balance is 1000.00 | 1. Select option 3 2. Enter 100.00 | System displays "Amount debited. New balance: 000900.00" and balance is updated | | | Balance decreased by 100.00 |
| TC-21 | Debit with sufficient funds (large amount) | System is running, balance is 1000.00 | 1. Select option 3 2. Enter 800.00 | System displays "Amount debited. New balance: 000200.00" and balance is updated | | | Balance decreased by 800.00 |
| TC-22 | Debit exact remaining balance | System is running, balance is 1000.00 | 1. Select option 3 2. Enter 1000.00 exactly | System displays "Amount debited. New balance: 000000.00" | | | Account reduced to zero |
| TC-23 | Debit exceeds available balance | System is running, balance is 1000.00 | 1. Select option 3 2. Enter 1000.01 | System displays "Insufficient funds for this debit." and balance remains 001000.00 | | | CRITICAL: No negative balance allowed |
| TC-24 | Debit insufficient funds error message | System is running, balance is 500.00 | 1. Select option 3 2. Enter 600.00 | System displays "Insufficient funds for this debit." | | | Clear error message for rejection |
| TC-25 | Debit with insufficient funds preserves balance | System is running, balance is 500.00 | 1. Attempt to debit 600.00 2. View balance | Balance remains unchanged at 000500.00 | | | Balance not modified on failed debit |
| TC-26 | Debit with decimal amount (sufficient funds) | System is running, balance is 1000.00 | 1. Select option 3 2. Enter 250.50 | System displays "Amount debited. New balance: 000749.50" | | | Handles decimal precision |
| TC-27 | Multiple sequential debits | System is running, balance is 1000.00 | 1. Debit 100.00 2. Debit 200.00 3. Debit 300.00 | All debits succeed. Final balance: 000400.00 | | | Cumulative debit operations |
| TC-28 | Debit after credit sufficient funds | System is running, balance is 1000.00 | 1. Credit 500.00 (balance: 1500.00) 2. Debit 800.00 | System displays "Amount debited. New balance: 000700.00" | | | Debit succeeds on increased balance |
| TC-29 | Debit zero amount | System is running, balance is 1000.00 | 1. Select option 3 2. Enter 0 | System displays "Amount debited. New balance: 001000.00" | | | Zero debit allowed |
| TC-30 | Debit from zero balance | System is running, balance is 0.00 | 1. Select option 3 2. Enter 1.00 | System displays "Insufficient funds for this debit." | | | No debit from already empty account |

---

### Integration & Complex Scenario Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-31 | Complex mixed transaction sequence | System is running, initial balance 1000.00 | 1. Credit 500.00 (1500.00) 2. Debit 300.00 (1200.00) 3. Credit 250.00 (1450.00) 4. Debit 1500.00 (fails) 5. View balance | Final balance: 001450.00 (last debit rejected) | | | Tests all operations in sequence |
| TC-32 | Boundary test - balance near zero | System is running | 1. Debit 950.00 (balance: 50.00) 2. Debit 50.00 exactly | Final balance: 000000.00 | | | Exact boundary condition |
| TC-33 | Boundary test - balance crosses zero attempt | System is running, balance: 50.00 | 1. Debit 50.01 | System displays "Insufficient funds for this debit." and balance: 000050.00 | | | Prevents crossing zero |
| TC-34 | Account never goes negative | System is running | 1. Perform series of debits attempting to exceed balance | Balance never goes below 0.00, system rejects over-limit debits | | | CRITICAL: Business rule validation |
| TC-35 | Transaction history accumulation | System is running | 1. Perform 10 credits 2. Perform 5 debits 3. View balance | Balance correctly reflects all 15 transactions | | | Accuracy over extended use |
| TC-36 | Menu navigation after transaction errors | System is running, rejected debit attempted | 1. Attempt failed debit 2. Menu is displayed again | System returns to menu, ready for next operation | | | Error recovery |
| TC-37 | Precision validation throughout session | System is running | 1. Credit 100.01 2. Debit 99.99 3. Credit 0.01 4. View balance | Balance: 001000.03 (exact precision maintained) | | | Decimal accuracy across operations |

---

### Edge Case & Error Handling Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-38 | Very small credit amount | System is running, balance: 1000.00 | 1. Select option 2 2. Enter 0.01 | System displays "Amount credited. New balance: 001000.01" | | | Minimum transaction unit |
| TC-39 | Very small debit amount | System is running, balance: 1000.00 | 1. Select option 3 2. Enter 0.01 | System displays "Amount debited. New balance: 000999.99" | | | Minimum transaction unit |
| TC-40 | Negative input handling (credit) | System is running | 1. Select option 2 2. Enter -100 | System behavior for negative input (implementation-dependent) | | | Edge case for legacy COBOL |
| TC-41 | Negative input handling (debit) | System is running | 1. Select option 3 2. Enter -100 | System behavior for negative input (implementation-dependent) | | | Edge case for legacy COBOL |
| TC-42 | Non-numeric input for amount (credit) | System is running, menu within credit operation | 1. Select option 2 2. Enter "ABC" | System prompts for valid numeric input or displays error | | | Input validation |
| TC-43 | Non-numeric input for amount (debit) | System is running, menu within debit operation | 1. Select option 3 2. Enter "XYZ" | System prompts for valid numeric input or displays error | | | Input validation |
| TC-44 | Very large credit (at max limit) | System is running, balance: 1000.00 | 1. Credit 999999.99 | System displays new balance: 1000999.99 or error if overflow | | | Boundary test for data type |
| TC-45 | Very large debit attempt | System is running, balance: 1000.00 | 1. Debit 999999.99 | System displays "Insufficient funds for this debit." | | | Rejects over-limit debit |

---

### Data Validation & Persistence Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-46 | Balance persists within session | System is running, balance: 1500.00 | 1. Perform credit 2. Perform 3 balance inquiries | All balance inquiries show 1500.00 | | | In-memory persistence verified |
| TC-47 | All decimal places maintained | System is running | 1. Series of transactions with various decimals 2. View balance | All decimal places preserved (99 cent accuracy) | | | Accounting precision |
| TC-48 | Data format consistency (NNNNNN.NN) | System is running, multiple balance views | 1. Observe balance display format after each operation | All balances display as NNNNNN.NN format (e.g., 001234.56) | | | Format consistency |
| TC-49 | Balance recovery after failed operation | System is running, balance: 500.00 | 1. Attempt debit of 1000.00 (fails) 2. View balance | Balance remains exactly 000500.00 | | | No corruption on failure |
| TC-50 | Operation parameters passed correctly | System is running | 1. Each operation (credit/debit/view) 2. Verify correct module called | Operations module receives correct PASSED-OPERATION parameter | | | Verify inter-module communication |

---

## Test Coverage Summary

| Coverage Area | Test Cases | Coverage % |
|---|---|---|
| Menu Navigation & Validation | TC-01 to TC-07 | 100% |
| View Balance Operations | TC-08 to TC-12 | 100% |
| Credit Account Operations | TC-13 to TC-19 | 100% |
| Debit Account Operations | TC-20 to TC-30 | 100% |
| Integration & Complex Scenarios | TC-31 to TC-37 | 100% |
| Edge Cases & Error Handling | TC-38 to TC-45 | 100% |
| Data Validation & Persistence | TC-46 to TC-50 | 100% |
| **TOTAL** | **50 Test Cases** | **100%** |

---

## Critical Business Rules Verified

1. ✓ **Account Balance Never Goes Negative** (TC-23, TC-24, TC-30, TC-33, TC-34, TC-45)
2. ✓ **Insufficient Funds Rejection** (TC-23, TC-24, TC-25, TC-30)
3. ✓ **Initial Balance = 1000.00** (TC-08)
4. ✓ **Decimal Precision Maintained** (TC-16, TC-18, TC-37, TC-47, TC-48)
5. ✓ **In-Session Data Persistence** (TC-46)
6. ✓ **All-or-Nothing Transactions** (TC-31, TC-33)

---

## Notes for Node.js Modernization

### Mapping to Unit Tests
- **Menu/Navigation Tests** (TC-01 to TC-07) → Route/Controller tests
- **View Balance Tests** (TC-08 to TC-12) → GET endpoint tests
- **Credit Tests** (TC-13 to TC-19) → POST endpoint tests (deposits)
- **Debit Tests** (TC-20 to TC-30) → POST endpoint tests (withdrawals)
- **Integration Tests** (TC-31 to TC-50) → Full workflow tests

### Node.js Implementation Considerations
- Use Jest/Mocha for unit testing framework
- Create mock data layer for balance storage
- Implement input validation middleware
- Use decimal library (Decimal.js) for precise currency handling
- Store test cases as Jest test suites following similar structure
- Maintain business rule validation in service layer
- Create integration tests simulating complete user workflows

### Data Model for Node.js
```javascript
interface AccountBalance {
  balance: Decimal;  // Use Decimal.js for precision
  lastUpdated: Date;
}

interface Transaction {
  type: 'CREDIT' | 'DEBIT';
  amount: Decimal;
  timestamp: Date;
  resultingBalance: Decimal;
  status: 'SUCCESS' | 'FAILED';
  reason?: string;
}
```

---

## Test Execution Instructions

1. Start the compiled COBOL application
2. Execute test cases sequentially or per test group
3. Record actual results in the "Actual Result" column
4. Record status as Pass/Fail
5. Add any observations in Comments column
6. Compare with Expected Results for validation

---

**Test Plan Status:** Ready for Business Stakeholder Review  
**Next Steps:** Stakeholder sign-off → Node.js Implementation → Unit/Integration Test Creation
