# Accounting System - Node.js Implementation

## Overview
This is the modernized Node.js implementation of the legacy COBOL Account Management System. The application preserves all original business logic while providing an improved codebase structure.

## Architecture

### Original COBOL Structure → Node.js Implementation

```
COBOL (3 files)              Node.js (Single file)
├─ main.cob                  ├─ MainProgram class
│  (Menu interface)          │  (Menu interface & loop)
├─ operations.cob            ├─ Operations class
│  (Business logic)          │  (Credit, Debit, View operations)
└─ data.cob                  └─ DataManager class
   (Data storage)               (In-memory balance storage)
```

### Key Components

1. **DataManager Class**
   - Manages in-memory balance storage
   - Methods: `read()`, `write()`, `getFormattedBalance()`
   - Initial balance: 1000.00 (as per original COBOL)

2. **Operations Class**
   - Handles account operations: credit, debit, view balance
   - Implements business logic with validation
   - Ensures: No negative balance, decimal precision, all-or-nothing transactions

3. **MainProgram Class**
   - Menu-driven interface
   - User interaction and choice validation
   - Program loop control

## Installation

```bash
cd src/accounting
npm install
```

### Dependencies
- **decimal.js** - Precise decimal arithmetic for currency operations
- **inquirer** - Interactive command-line interface

## Running the Application

### Option 1: Direct execution
```bash
npm start
```

### Option 2: Watch mode (auto-restart on file changes)
```bash
npm run dev
```

### Option 3: VS Code Debugger
1. Set breakpoints in `index.js`
2. Press `F5` or go to Run → Start Debugging
3. Select "Launch Node.js Accounting App" configuration
4. Use the debug console for execution

## Usage

The application provides a menu-driven interface:

```
Account Management System
1. View Balance        - Display current account balance
2. Credit Account      - Deposit funds into account
3. Debit Account       - Withdraw funds from account
4. Exit                - Terminate the program
```

### Example Session
```
Enter your choice (1-4): 1
Current balance: 001000.00

Enter your choice (1-4): 2
Enter credit amount: 500
Amount credited. New balance: 001500.00

Enter your choice (1-4): 3
Enter debit amount: 300
Amount debited. New balance: 001200.00

Enter your choice (1-4): 4
Exiting the program. Goodbye!
```

## Business Rules

✓ **Initial Balance**: 1000.00  
✓ **No Negative Balance**: Debit operations rejected if insufficient funds  
✓ **Decimal Precision**: All amounts maintain 2 decimal places (currency format)  
✓ **All-or-Nothing Transactions**: Partial transactions not allowed  
✓ **In-Session Persistence**: Balance maintained during program execution  

## Data Models

### Balance Format
- **COBOL Format**: PIC 9(6)V99 (e.g., 001000.00)
- **Node.js Format**: Decimal.js with 2 decimal places
- **Range**: 0.00 to 999999.99

### Operation Types
```javascript
{
  TOTAL: 'View Balance',
  CREDIT: 'Add funds',
  DEBIT: 'Withdraw funds'
}
```

## Preserved Features from COBOL

✓ Menu system with 4 options  
✓ Input validation and error messages  
✓ Business rule: No overdrafts allowed  
✓ Balance formatting (leading zeros, 2 decimals)  
✓ Operation loop until exit  
✓ Clear error messages for invalid operations  

## Migration Notes for Testing

This Node.js implementation maintains compatibility with the test plan defined in `docs/TESTPLAN.md`. All 50 test cases from the original COBOL test plan can be adapted to Node.js unit tests using Jest/Mocha:

- **Unit Tests**: Individual operation tests (credit, debit, view balance)
- **Integration Tests**: Complete workflow scenarios
- **Edge Case Tests**: Boundary conditions, negative amounts, overflow scenarios

### Example Jest Test Structure
```javascript
describe('Operations - View Balance', () => {
  test('TC-08: View initial balance', () => {
    const result = operations.viewBalance();
    expect(result.balance).toEqual(new Decimal('1000.00'));
  });
});

describe('Operations - Credit Account', () => {
  test('TC-13: Credit with positive amount', () => {
    const result = operations.creditAccount(10.00);
    expect(result.success).toBe(true);
    expect(result.newBalance).toEqual(new Decimal('1010.00'));
  });
});

describe('Operations - Debit Account', () => {
  test('TC-23: Debit exceeds balance (insufficient funds)', () => {
    const result = operations.debitAccount(1000.01);
    expect(result.success).toBe(false);
    expect(result.insufficientFunds).toBe(true);
  });
});
```

## Development

### File Structure
```
src/accounting/
├── index.js           - Main application file (all-in-one)
├── package.json       - Dependencies and scripts
├── package-lock.json  - Locked dependency versions
└── node_modules/      - Installed packages
```

### Extending the Application

To add new features in the future:

1. **Add new operations** - Extend the `Operations` class
2. **Add new menu items** - Extend `MainProgram` class
3. **Refactor to modules** - Split into separate files:
   - `dataManager.js` - DataManager class
   - `operations.js` - Operations class
   - `ui.js` - MainProgram class
   - `index.js` - Entry point

### Future Improvements

- [ ] Persistent file storage (JSON/Database)
- [ ] User authentication and multiple accounts
- [ ] Transaction history logging
- [ ] REST API layer
- [ ] Web UI (React/Vue)
- [ ] Unit tests with Jest
- [ ] Integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Debugging

### Enable Debug Output
Add console.log statements or use VS Code debugger:

1. Set breakpoints in `index.js`
2. Launch with `F5`
3. Use Debug Console to inspect variables

### Common Issues

**Issue**: "Cannot find module 'decimal.js'"  
**Solution**: Run `npm install` in the `src/accounting` directory

**Issue**: "Syntax error near..."  
**Solution**: Ensure Node.js version 14+ is installed (`node --version`)

## Comparison: COBOL vs Node.js

| Aspect | COBOL | Node.js |
|--------|-------|---------|
| Compilation | Required | Not required (interpreted) |
| Execution | `cobc -x && ./accountsystem` | `npm start` |
| Data Types | PIC clauses | JavaScript/Decimal.js |
| UI Framework | COBOL DISPLAY | inquirer.js |
| Precision Math | Inherent | decimal.js library |
| Modularity | 3 separate files | Single file (easily refactorable) |
| Testing | Manual | Automated (Jest/Mocha) |
| Maintenance | Low-level, verbose | High-level, maintainable |

## Running Tests

Once Jest is integrated, run tests with:
```bash
npm test
```

## Documentation

- Original COBOL architecture: See `docs/README.md`
- Data flow diagram: See `docs/README.md` (Sequence Diagram section)
- Test plan: See `docs/TESTPLAN.md`

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: April 8, 2026
