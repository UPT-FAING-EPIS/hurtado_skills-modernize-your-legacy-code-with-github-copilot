/**
 * Account Management System - Node.js Implementation
 * Modernized from COBOL Legacy Application
 * 
 * Original COBOL Architecture:
 * - MainProgram (main.cob) → Menu interface
 * - Operations (operations.cob) → Business logic
 * - DataProgram (data.cob) → Data persistence
 * 
 * Node.js Implementation:
 * - Unified single-file application
 * - Preserves original business logic and data flow
 * - Maintains decimal precision for currency operations
 */

import Decimal from 'decimal.js';
import prompt from 'prompt-sync';

// ===========================
// DATA LAYER (from data.cob)
// ===========================

/**
 * DataProgram Module
 * Manages in-memory storage and retrieval of account balance
 * Original: DataProgram.cob with STORAGE-BALANCE
 */
class DataManager {
  constructor() {
    // Initial balance: 1000.00 (as per original COBOL STORAGE-BALANCE value)
    this.storageBalance = new Decimal('1000.00');
  }

  /**
   * READ operation
   * Retrieves current balance from storage
   * Equivalent to COBOL: IF OPERATION-TYPE = 'READ' MOVE STORAGE-BALANCE TO BALANCE
   */
  read() {
    return this.storageBalance;
  }

  /**
   * WRITE operation
   * Persists balance to storage
   * Equivalent to COBOL: IF OPERATION-TYPE = 'WRITE' MOVE BALANCE TO STORAGE-BALANCE
   */
  write(balance) {
    this.storageBalance = new Decimal(balance);
  }

  /**
   * Get formatted balance string
   * Matches COBOL format: PIC 9(6)V99 (e.g., 001000.00)
   */
  getFormattedBalance() {
    const balance = this.storageBalance.toString();
    const parts = balance.split('.');
    const integerPart = parts[0].padStart(6, '0');
    const decimalPart = (parts[1] || '00').padEnd(2, '0');
    return `${integerPart}.${decimalPart}`;
  }
}

// ===========================
// OPERATIONS LAYER (from operations.cob)
// ===========================

/**
 * Operations Module
 * Processes account operations with business rule validation
 * Original: Operations.cob with CREDIT, DEBIT, TOTAL operations
 */
class Operations {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  /**
   * TOTAL operation
   * View balance without modification
   * Equivalent to COBOL: IF OPERATION-TYPE = 'TOTAL'
   */
  viewBalance() {
    const balance = this.dataManager.read();
    return {
      success: true,
      balance: balance,
      formattedBalance: this.dataManager.getFormattedBalance(),
      message: `Current balance: ${this.dataManager.getFormattedBalance()}`
    };
  }

  /**
   * CREDIT operation
   * Add funds to account
   * Equivalent to COBOL: ELSE IF OPERATION-TYPE = 'CREDIT'
   *   ADD AMOUNT TO FINAL-BALANCE
   *   CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
   */
  creditAccount(amount) {
    try {
      const amountDecimal = new Decimal(amount);
      
      // Validate amount
      if (amountDecimal.lessThan(0)) {
        return {
          success: false,
          message: 'Credit amount cannot be negative.'
        };
      }

      // Get current balance
      const currentBalance = this.dataManager.read();
      
      // Calculate new balance
      const newBalance = currentBalance.plus(amountDecimal);
      
      // Validate against maximum (PIC 9(6)V99 = 999999.99)
      const maxAmount = new Decimal('999999.99');
      if (newBalance.greaterThan(maxAmount)) {
        return {
          success: false,
          message: `Credit exceeds maximum account balance (${maxAmount}).`
        };
      }

      // Write new balance to storage
      this.dataManager.write(newBalance);

      return {
        success: true,
        previousBalance: currentBalance,
        amount: amountDecimal,
        newBalance: newBalance,
        formattedBalance: this.dataManager.getFormattedBalance(),
        message: `Amount credited. New balance: ${this.dataManager.getFormattedBalance()}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Credit operation failed: ${error.message}`
      };
    }
  }

  /**
   * DEBIT operation
   * Withdraw funds from account with insufficient funds validation
   * Equivalent to COBOL:
   *   ELSE IF OPERATION-TYPE = 'DEBIT '
   *   IF FINAL-BALANCE >= AMOUNT
   *     SUBTRACT AMOUNT FROM FINAL-BALANCE
   *     CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
   *   ELSE
   *     DISPLAY "Insufficient funds for this debit."
   */
  debitAccount(amount) {
    try {
      const amountDecimal = new Decimal(amount);
      
      // Validate amount
      if (amountDecimal.lessThan(0)) {
        return {
          success: false,
          message: 'Debit amount cannot be negative.'
        };
      }

      // Get current balance
      const currentBalance = this.dataManager.read();

      // Critical Business Rule: Validate sufficient funds
      // COBOL: IF FINAL-BALANCE >= AMOUNT
      if (currentBalance.lessThan(amountDecimal)) {
        return {
          success: false,
          insufficientFunds: true,
          message: 'Insufficient funds for this debit.',
          currentBalance: currentBalance,
          requestedAmount: amountDecimal
        };
      }

      // Calculate new balance
      const newBalance = currentBalance.minus(amountDecimal);

      // Write new balance to storage
      this.dataManager.write(newBalance);

      return {
        success: true,
        previousBalance: currentBalance,
        amount: amountDecimal,
        newBalance: newBalance,
        formattedBalance: this.dataManager.getFormattedBalance(),
        message: `Amount debited. New balance: ${this.dataManager.getFormattedBalance()}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Debit operation failed: ${error.message}`
      };
    }
  }
}

// ===========================
// PRESENTATION LAYER (from main.cob)
// ===========================

/**
 * MainProgram Module
 * Menu-driven interface and program controller
 * Equivalent to COBOL: MainProgram.cob with main menu loop
 */
class MainProgram {
  constructor(operations) {
    this.operations = operations;
    this.continueFlag = true;
    this.prompt = prompt();
  }

  /**
   * Display main menu
   * Equivalent to COBOL menu display
   */
  displayMenu() {
    console.clear();
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Handle view balance operation
   * User choice: 1
   * COBOL: CALL 'Operations' USING 'TOTAL'
   */
  handleViewBalance() {
    const result = this.operations.viewBalance();
    console.log(`\n${result.message}`);
  }

  /**
   * Handle credit account operation
   * User choice: 2
   * COBOL: CALL 'Operations' USING 'CREDIT'
   */
  handleCreditAccount() {
    const amountStr = this.prompt('Enter credit amount: ');
    const amount = parseFloat(amountStr);

    if (isNaN(amount)) {
      console.log('✗ Error: Please enter a valid number.');
      return;
    }

    const result = this.operations.creditAccount(amount);
    
    if (result.success) {
      console.log(`\n${result.message}`);
    } else {
      console.log(`\n✗ Error: ${result.message}`);
    }
  }

  /**
   * Handle debit account operation
   * User choice: 3
   * COBOL: CALL 'Operations' USING 'DEBIT'
   */
  handleDebitAccount() {
    const amountStr = this.prompt('Enter debit amount: ');
    const amount = parseFloat(amountStr);

    if (isNaN(amount)) {
      console.log('✗ Error: Please enter a valid number.');
      return;
    }

    const result = this.operations.debitAccount(amount);
    
    if (result.success) {
      console.log(`\n${result.message}`);
    } else {
      console.log(`\n✗ Error: ${result.message}`);
    }
  }

  /**
   * Main program loop
   * Equivalent to COBOL: PERFORM UNTIL CONTINUE-FLAG = 'NO'
   */
  run() {
    console.log('Starting Account Management System...\n');
    
    while (this.continueFlag) {
      this.displayMenu();
      
      const choiceStr = this.prompt('Enter your choice (1-4): ');
      const choice = choiceStr.trim();

      // Validate input
      if (!['1', '2', '3', '4'].includes(choice)) {
        console.log('\n✗ Invalid choice, please select 1-4.');
        continue;
      }

      // Evaluate user choice
      // COBOL: EVALUATE USER-CHOICE
      switch (choice) {
        case '1':
          // View Balance: CALL 'Operations' USING 'TOTAL'
          this.handleViewBalance();
          break;
        case '2':
          // Credit Account: CALL 'Operations' USING 'CREDIT'
          this.handleCreditAccount();
          break;
        case '3':
          // Debit Account: CALL 'Operations' USING 'DEBIT'
          this.handleDebitAccount();
          break;
        case '4':
          // Exit: MOVE 'NO' TO CONTINUE-FLAG
          this.continueFlag = false;
          break;
        default:
          console.log('\n✗ Invalid choice, please select 1-4.');
      }
    }

    // Exit message and program termination
    console.log('\nExiting the program. Goodbye!');
    process.exit(0);
  }
}

// ===========================
// APPLICATION ENTRY POINT
// ===========================

/**
 * Initialize and run the application
 * Equivalent to COBOL program execution
 */
function main() {
  try {
    // Initialize data layer (DataProgram equivalent)
    const dataManager = new DataManager();

    // Initialize operations layer (Operations equivalent)
    const operations = new Operations(dataManager);

    // Initialize presentation layer (MainProgram equivalent)
    const mainProgram = new MainProgram(operations);

    // Run main program loop
    mainProgram.run();
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

// Export classes for testing
export { DataManager, Operations, MainProgram };

// Run application only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  main();
}
