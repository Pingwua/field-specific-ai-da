declare global {
  interface Window {
    spark: {
      llm: (prompt: any, model?: string) => Promise<string>;
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => any;
      user: {
        isOwner: boolean;
        login: string;
      };
    };
  }
}

declare module '@github/spark/hooks' {
  export function useKV<T>(key: string, initialValue: T): [T, (value: T) => void, () => void];
}

export {};