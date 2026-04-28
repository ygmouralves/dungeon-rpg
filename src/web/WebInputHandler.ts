import type { IInputHandler } from '../ui/IInputHandler';
import type { WebChannel } from './WebChannel';

export class WebInputHandler implements IInputHandler {
  constructor(private readonly _channel: WebChannel) {}

  ask(prompt: string): Promise<string> {
    return new Promise(resolve => {
      const choices = this._channel.consumePendingChoices();

      if (choices) {
        this._channel.send({ type: 'PROMPT', kind: 'choice', choices });
      } else {
        this._channel.send({ type: 'PROMPT', kind: 'text', placeholder: prompt });
      }

      this._channel.once('input', resolve);
    });
  }

  async confirm(prompt: string): Promise<boolean> {
    this._channel.send({
      type: 'PROMPT',
      kind: 'choice',
      choices: [
        { value: 's', label: '✅ Sim' },
        { value: 'n', label: '❌ Não' },
      ],
    });
    const answer = await new Promise<string>(resolve =>
      this._channel.once('input', resolve),
    );
    return answer.toLowerCase() === 's';
  }

  close(): void { /* WebSocket closed server-side */ }
}
