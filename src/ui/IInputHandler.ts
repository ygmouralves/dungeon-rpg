export interface IInputHandler {
  ask(prompt: string): Promise<string>;
  confirm(prompt: string): Promise<boolean>;
  close(): void;
}
