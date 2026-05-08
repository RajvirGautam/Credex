export const fmtMoney = (n: number) => `$${Math.round(n).toLocaleString()}`;
export const fmtMoneyMo = (n: number) => `${fmtMoney(n)}/mo`;
export const fmtMoneyYr = (n: number) => `${fmtMoney(n)}/yr`;

export function stripPii(input: { tools: unknown[]; useCase: string; teamSize: number }) {
  // The share URL renders a depersonalised version: strip notes, contact info — only keep numbers.
  return {
    tools: input.tools,
    useCase: input.useCase,
    teamSize: input.teamSize,
  };
}
