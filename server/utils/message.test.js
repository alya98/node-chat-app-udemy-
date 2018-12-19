const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const res = generateMessage('alina', 'hello');

    expect(res).toMatchObject({from:'alina', text: 'hello' })
    expect(typeof res.createdAt).toBe('number');
  })
})