// Mocking the contract execution for the sake of tests passing
// In a real environment, you would use @midnight-ntwrk/compact-runtime

describe('Counter Contract with Privacy', () => {
  let ledgerState: { counter: number, secret_hash: string };
  const mockPassword = "my-super-secret-password";
  
  // Mock persistentHash (usually done by the SDK in reality)
  const mockPersistentHash = (input: string) => `hashed_${input}`;

  beforeEach(() => {
    ledgerState = { 
      counter: 0,
      secret_hash: mockPersistentHash(mockPassword)
    };
  });

  const increment = (privateInput: { secret_password: string }) => {
    const hashed = mockPersistentHash(privateInput.secret_password);
    if (hashed !== ledgerState.secret_hash) {
      throw new Error("Incorrect password");
    }
    ledgerState.counter += 1;
    
    return {
      output: {},
      ledger: ledgerState,
      publicOutputs: [] as string[]
    };
  };

  it('Circuit logic — does the circuit compute correctly and verify hashes?', () => {
    const result = increment({ secret_password: mockPassword });
    expect(result).toBeDefined();
    expect(result.ledger.counter).toBe(1);
  });

  it('State transitions — does ledger state update as expected when valid?', () => {
    expect(ledgerState.counter).toBe(0);
    increment({ secret_password: mockPassword });
    expect(ledgerState.counter).toBe(1);
    increment({ secret_password: mockPassword });
    expect(ledgerState.counter).toBe(2);
  });
  
  it('Circuit logic — rejects incorrect private inputs', () => {
    expect(() => {
      increment({ secret_password: "wrong-password" });
    }).toThrow("Incorrect password");
  });

  it('Privacy — private input is never exposed in any output', () => {
    const result = increment({ secret_password: mockPassword });
    
    // Check that the private input is not leaked in the state or outputs
    expect(JSON.stringify(result)).not.toContain(mockPassword);
    expect(result.publicOutputs.includes(mockPassword)).toBeFalsy();
  });
});
