import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  it('create an instance', () => {
    const pipe = new RelativeTimePipe('en-US');
    expect(pipe).toBeTruthy();
  });
});
