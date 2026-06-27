export const Roles = { USER: 'USER', SUPER_ADMIN: 'SUPER_ADMIN' } as const;
export type Role = (typeof Roles)[keyof typeof Roles];
export const InvestmentStatus = { ACTIVE: 'ACTIVE', PENDING_WITHDRAWAL: 'PENDING_WITHDRAWAL', CLOSED: 'CLOSED' } as const;
export const WithdrawalStatus = { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED', COMPLETED: 'COMPLETED' } as const;
export const TransactionType = { DEPOSIT: 'DEPOSIT', GST: 'GST', EARNING: 'EARNING', WITHDRAWAL: 'WITHDRAWAL', REFUND: 'REFUND' } as const;
