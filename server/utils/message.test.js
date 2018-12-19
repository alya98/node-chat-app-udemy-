const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const res = generateMessage('alina', 'hello');

    expect(res).toMatchObject({from:'alina', text: 'hello' })
    expect(typeof res.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const latitude = 53.893237299999996;
    const longitude = 27.5379579;
    const res = generateLocationMessage('admin', latitude, longitude);

    expect(res).toMatchObject({from:'admin', url: `https://www.google.com/maps?q=${latitude},${longitude}`})
    expect(typeof res.createdAt).toBe('number');
  });
});