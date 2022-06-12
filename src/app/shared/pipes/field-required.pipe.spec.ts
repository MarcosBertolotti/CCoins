import { FieldRequiredPipe } from './field-required.pipe';

describe('FieldRequiredPipe', () => {
  it('create an instance', () => {
    const pipe = new FieldRequiredPipe();
    expect(pipe).toBeTruthy();
  });
});
