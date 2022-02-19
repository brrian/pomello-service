import createEventEmitter from '../createEventEmitter';

describe('Event Emitter', () => {
  it('should call handlers with the proper data', () => {
    const { on, emit } = createEventEmitter();

    const handleOneEmit = jest.fn();
    const handleOneMoreEmit = jest.fn();
    const handleTwoEmit = jest.fn();

    on('one', handleOneEmit);
    on('one', handleOneMoreEmit);
    on('two', handleTwoEmit);

    emit('one', { success: true });
    emit('two', { success: 'true' });

    expect(handleOneEmit).toHaveBeenCalledWith({ success: true });
    expect(handleOneMoreEmit).toHaveBeenCalledWith({ success: true });
    expect(handleTwoEmit).toHaveBeenCalledWith({ success: 'true' });
  });

  it('should remove handlers', () => {
    const { on, off, emit } = createEventEmitter();

    const handleOneEmit = jest.fn();

    on('one', handleOneEmit);
    emit('one', { success: true });

    expect(handleOneEmit).toHaveBeenCalledWith({ success: true });

    off('one', handleOneEmit);
    handleOneEmit.mockClear();

    expect(handleOneEmit).not.toHaveBeenCalled();
  });

  it('should handle unsubscribing from non-existent handlers', () => {
    const { off } = createEventEmitter();

    expect(() => off('one', () => null)).not.toThrowError();
  });

  it('should handle emitting to non-existent handlers', () => {
    const { emit } = createEventEmitter();

    expect(() => emit('one', { success: true })).not.toThrowError();
  });
});
