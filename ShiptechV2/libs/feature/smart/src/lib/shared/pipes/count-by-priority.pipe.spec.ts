import { CountByPriorityPipe } from './count-by-priority.pipe';

describe('CountByPriorityPipe', () => {
  it('create an instance', () => {
    const pipe = new CountByPriorityPipe();
    expect(pipe).toBeTruthy();
  });
});
