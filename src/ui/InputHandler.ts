import readline from 'readline';

export class InputHandler {
  private readonly _rl: readline.Interface;

  constructor() {
    this._rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }

  ask(prompt: string): Promise<string> {
    return new Promise(resolve => this._rl.question(prompt, answer => resolve(answer.trim())));
  }

  async confirm(prompt: string): Promise<boolean> {
    const answer = await this.ask(`${prompt} (s/n) `);
    return answer.toLowerCase() === 's';
  }

  close(): void { this._rl.close(); }
}
