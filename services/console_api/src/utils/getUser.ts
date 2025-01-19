import {User} from '../models/user.model';

/**
 * Creates and returns a new User instance.
 * @param userData An object containing data to initialize the User instance.
 * @returns A new User instance initialized with the provided data.
 */
function createUserInstance(userData: Partial<User>): User {
  return new User(userData);
}
export const getUser =  function(){
  const newUser = createUserInstance({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    defaultTenant: 1,
    // other properties can be initialized as needed
  });
  return newUser;
}
