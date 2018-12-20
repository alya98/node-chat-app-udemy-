const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'Alina',
      room: 'NodeJs'
    },
    {
      id: 2,
      name: 'Sonya',
      room: 'React'
    },
    {
      id: 3,
      name: 'Polina',
      room: 'NodeJs'
    }];
  })

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: 'dsfertw45tr453',
      name: 'Alina',
      room: 'Fruits'
    }
    const resUser = users.addUser(user.id,user.name,user.room);
    expect(users.users).toEqual([user])
  });

  it('should show users for nodejs room', () => {
    expect(users.getUserList('NodeJs')).toEqual(['Alina', 'Polina'])
  });

  it('should delete a user by id', () => {
    expect(users.removeUser(3)).toEqual({
      id: 3,
      name: 'Polina',
      room: 'NodeJs'
    });
    expect(users.users.length).toBe(2);
  });

  it('should not delete a user by id', () => {
    expect(users.removeUser(2323)).toBeFalsy();
  });

  it('should show user by id', () => {
    expect(users.getUser(2)).toEqual({
      id: 2,
      name: 'Sonya',
      room: 'React'
    })
  });

  it('should not show user by id', () => {
    expect(users.getUser(674)).toBeFalsy();
  });
})