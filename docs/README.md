# COBOL Account Management System - Documentation

## Overview
This COBOL-based Account Management System provides a menu-driven interface for managing student accounts. The system allows users to view account balances, credit accounts, and debit accounts with built-in validation and business rules.

## Architecture

The system follows a three-module architecture:

```
MainProgram (main.cob)
    ↓
Operations (operations.cob)
    ↓
DataProgram (data.cob)
```

---

## File Descriptions

### 1. main.cob - `MainProgram`

**Purpose:** 
Entry point and user interface controller for the Account Management System.

**Key Functions:**
- Displays an interactive menu with four options
- Accepts user input for operation selection
- Dispatches calls to the Operations module based on user choice
- Manages program loop and exit conditions

**Menu Options:**
1. **View Balance** - Displays current account balance
2. **Credit Account** - Adds funds to the account
3. **Debit Account** - Withdraws funds from the account
4. **Exit** - Terminates the program

**Working Variables:**
- `USER-CHOICE`: Stores user's menu selection (numeric, 1-4)
- `CONTINUE-FLAG`: Controls the main program loop (YES/NO)

**Business Logic:**
- Continuously loops until user selects exit (option 4)
- Validates that user choice is between 1-4
- Passes operation type strings to Operations module: 'TOTAL', 'CREDIT', 'DEBIT'

---

### 2. operations.cob - `Operations`

**Purpose:**
Processes account operations (balance inquiries, credits, and debits) with business rule validation.

**Key Functions:**
- **View Balance**: Retrieves and displays current account balance
- **Credit Account**: Accepts deposit amount and updates balance positively
- **Debit Account**: Accepts withdrawal amount and validates against available funds before debiting
- **Insufficient Funds Check**: Prevents debits that exceed current balance

**Linkage Parameters:**
- `PASSED-OPERATION`: Operation type passed from MainProgram ('TOTAL', 'CREDIT', or 'DEBIT')

**Working Variables:**
- `OPERATION-TYPE`: Holds the operation flag (6-character string)
- `AMOUNT`: Stores the transaction amount (numeric, up to 999999.99)
- `FINAL-BALANCE`: Maintains current account balance (numeric, up to 999999.99)

**Business Rules:**

1. **Credit Operations:**
   - User enters credit amount
   - Amount is added to current balance
   - New balance is persisted via DataProgram
   - Confirmation message displays new balance

2. **Debit Operations:**
   - User enters debit amount
   - System validates sufficient funds: `IF FINAL-BALANCE >= AMOUNT`
   - If funds available: amount is subtracted and persisted
   - If insufficient funds: transaction is rejected with error message
   - No balance update occurs on failed debit

3. **Balance Inquiry:**
   - Retrieves current balance from DataProgram
   - Displays balance without modification

---

### 3. data.cob - `DataProgram`

**Purpose:**
Data persistence layer that manages account balance storage and retrieval.

**Key Functions:**
- **READ Operation**: Retrieves current balance from storage
- **WRITE Operation**: Persists balance to storage

**Linkage Parameters:**
- `PASSED-OPERATION`: Operation type ('READ' or 'WRITE')
- `BALANCE`: The balance value to read or write

**Working Variables:**
- `STORAGE-BALANCE`: In-memory storage for account balance (numeric, up to 999999.99)
- `OPERATION-TYPE`: Holds operation flag (6-character string)

**Data Storage:**
- Initial balance: **1000.00** (default account balance)
- All balances stored as numeric with 2 decimal places (currency format)
- Data is maintained in memory during program execution

---

## Business Rules Summary

### Student Account Rules

1. **Initial Balance**
   - All accounts start with a balance of **1000.00**

2. **Credit Transactions**
   - Unlimited credit/deposit amounts allowed
   - No upper limit validation implemented
   - Balance is immediately updated

3. **Debit Transactions (Withdraw)**
   - **CRITICAL RULE**: Account cannot go negative
   - Debit amount must not exceed current balance
   - Rejection message shown for insufficient funds
   - No partial debits allowed (all-or-nothing)

4. **Balance Inquiry**
   - Non-destructive read operation
   - Does not affect account balance

5. **Session Persistence**
   - Balance persists for the duration of the program session
   - In-memory storage only (not written to external files)
   - Balance resets to 1000.00 when program restarts

---

## Data Formats

| Field | Picture Clause | Format | Example |
|-------|---|---|---|
| Balance | PIC 9(6)V99 | NNNNNN.NN | 001234.56 |
| Amount | PIC 9(6)V99 | NNNNNN.NN | 000500.00 |
| Operation Type | PIC X(6) | X(6) Fixed | 'TOTAL ', 'CREDIT', 'DEBIT ' |
| Menu Choice | PIC 9 | 0-9 | 1, 2, 3, 4 |

---

## Program Flow Diagram

```
START
  ↓
Display Menu
  ↓
Accept User Choice
  ↓
  ├─→ [1] → Call Operations 'TOTAL' → Display Balance
  ├─→ [2] → Call Operations 'CREDIT' → Input Amount → Add to Balance → Update & Display
  ├─→ [3] → Call Operations 'DEBIT' → Input Amount → Check Funds → Debit or Reject
  └─→ [4] → Set CONTINUE-FLAG = 'NO'
  ↓
Display "Goodbye!" if [4] selected
  ↓
STOP
```

---

## Error Handling

| Scenario | Error Message | Recovery |
|----------|---------------|----------|
| Invalid menu choice (not 1-4) | "Invalid choice, please select 1-4." | Return to menu |
| Debit exceeds balance | "Insufficient funds for this debit." | Balance unchanged, return to menu |
| Invalid input (non-numeric) | System default behavior | Typically loops or waits for valid input |

---

## Future Modernization Considerations

- Migrate from COBOL to Java/Python for better maintainability
- Implement persistent database storage (currently in-memory only)
- Add comprehensive logging and audit trails
- Implement user authentication and account identification
- Add transaction history records
- Implement decimal arithmetic validation
- Consider microservices architecture for scalability

---

## Sequence Diagram - Data Flow

```mermaid
sequenceDiagram
    participant User
    participant MainProgram as MainProgram<br/>(main.cob)
    participant Operations as Operations<br/>(operations.cob)
    participant DataProgram as DataProgram<br/>(data.cob)

    User->>MainProgram: Menu Choice (1-4)
    
    rect rgb(200, 220, 255)
    Note over MainProgram,DataProgram: Operation 1: View Balance
    MainProgram->>Operations: CALL 'Operations' USING 'TOTAL '
    Operations->>DataProgram: CALL 'DataProgram' USING 'READ'
    DataProgram-->>Operations: Return STORAGE-BALANCE (e.g., 1000.00)
    Operations-->>MainProgram: Return with Balance
    MainProgram->>User: Display "Current balance: 1000.00"
    end

    User->>MainProgram: Menu Choice (2: Credit)
    
    rect rgb(200, 255, 220)
    Note over MainProgram,DataProgram: Operation 2: Credit Account
    MainProgram->>Operations: CALL 'Operations' USING 'CREDIT'
    Operations->>User: Prompt "Enter credit amount: "
    User-->>Operations: 500.00
    Operations->>DataProgram: CALL 'DataProgram' USING 'READ'
    DataProgram-->>Operations: Return STORAGE-BALANCE (1000.00)
    Note over Operations: ADD AMOUNT TO FINAL-BALANCE<br/>(1000.00 + 500.00 = 1500.00)
    Operations->>DataProgram: CALL 'DataProgram' USING 'WRITE' (1500.00)
    DataProgram->>DataProgram: MOVE BALANCE TO STORAGE-BALANCE
    DataProgram-->>Operations: Return
    Operations-->>MainProgram: Return with New Balance
    MainProgram->>User: Display "Amount credited. New balance: 1500.00"
    end

    User->>MainProgram: Menu Choice (3: Debit)
    
    rect rgb(255, 220, 200)
    Note over MainProgram,DataProgram: Operation 3: Debit Account
    MainProgram->>Operations: CALL 'Operations' USING 'DEBIT '
    Operations->>User: Prompt "Enter debit amount: "
    User-->>Operations: 300.00
    Operations->>DataProgram: CALL 'DataProgram' USING 'READ'
    DataProgram-->>Operations: Return STORAGE-BALANCE (1500.00)
    
    alt Sufficient Funds (1500.00 >= 300.00)
        Note over Operations: IF FINAL-BALANCE >= AMOUNT
        Note over Operations: SUBTRACT AMOUNT FROM FINAL-BALANCE<br/>(1500.00 - 300.00 = 1200.00)
        Operations->>DataProgram: CALL 'DataProgram' USING 'WRITE' (1200.00)
        DataProgram->>DataProgram: MOVE BALANCE TO STORAGE-BALANCE
        DataProgram-->>Operations: Return
        Operations-->>MainProgram: Return with New Balance
        MainProgram->>User: Display "Amount debited. New balance: 1200.00"
    else Insufficient Funds (e.g., 100.00 > 50.00)
        Note over Operations: IF FINAL-BALANCE < AMOUNT
        Operations-->>MainProgram: Return without Writing
        MainProgram->>User: Display "Insufficient funds for this debit."
    end

    User->>MainProgram: Menu Choice (4: Exit)
    MainProgram->>User: Display "Exiting the program. Goodbye!"
    MainProgram->>MainProgram: STOP RUN
```

### Data Flow Summary

**Flow Pattern:**
1. **User Input** → MainProgram receives menu selection
2. **Operation Call** → MainProgram dispatches to Operations module
3. **Data Read** → Operations calls DataProgram to READ current balance
4. **Business Logic** → Operations performs calculations or validations
5. **Data Write** (if needed) → Operations calls DataProgram to WRITE new balance
6. **Result Display** → MainProgram displays outcome to user
7. **Loop** → Returns to menu until user selects exit

**Key Data Elements Passed:**
- `OPERATION-TYPE` (TOTAL, CREDIT, DEBIT) - Determines operation behavior
- `FINAL-BALANCE` - Current account balance (returned from DataProgram READ)
- `AMOUNT` - Transaction amount (user input in Operations)
- `STORAGE-BALANCE` - Persistent in-memory balance storage (in DataProgram)
