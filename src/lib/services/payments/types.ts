/** Card data captured in the checkout backdrop. Never persisted. */
export interface CardInput {
  /** PAN with or without spaces. */
  number: string;
  cardHolder: string;
  /** Two digits, e.g. "06". */
  expMonth: string;
  /** Two digits, e.g. "29". */
  expYear: string;
  cvc: string;
}

/** Provider tokenization response (only the fields we consume). */
export interface CardTokenResponse {
  status: string;
  data: {
    id: string;
    brand?: string;
    last_four?: string;
  };
}

/** Result surfaced to the UI after tokenizing. */
export interface TokenizedCard {
  cardToken: string;
  lastFour: string;
}
