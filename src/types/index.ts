export interface Signer {
  id: string;
  name: string;
  email: string;
  status: "PENDING" | "SIGNED";
  signedAt?: Date;
}

export interface Document {
  id: string;
  name: string;
  status: "PENDING" | "PROCESSING" | "READY" | "COMPLETED";
  signers: Signer[];
  createdAt: Date;
  updatedAt: Date;
  fileUrl?: string;
}

export interface DocumentInput {
  name: string;
  description: string;
  fileUrl: string;
  signers: SignerInput[];
}

export interface SignerInput {
  name: string;
  email: string;
}
