import axios from 'axios';
import {GraphQLError} from 'graphql';
import {User, UserIdWithToken} from '../../interfaces/User';
import LoginMessageResponse from '../../interfaces/MessageResponse';

export default {
  Query: {
    users: async () => {
      const response = await axios.get(`${process.env.AUTH_URL}/users`);
      const users = response.data as User[];
      return users;
    },

    userById: async (_parent: unknown, args: {id: string}) => {
      const response = await axios.get(
        `${process.env.AUTH_URL}/users/${args.id}`
      );
      const user = response.data as User;
      return user;
    },

    checkToken: async (
      _parent: unknown,
      _args: unknown,
      user: UserIdWithToken
    ) => {
      const response = await axios.get(`${process.env.AUTH_URL}/users/token`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const userFromAuth = response.data;
      return userFromAuth;
    },
  },

  Mutation: {
    login: async (
      _parent: unknown,
      args: {credentials: {username: string; password: string}}
    ) => {
      const response = await axios.post(
        `${process.env.AUTH_URL}/auth/login`,
        args.credentials
      );
      const user = response.data as LoginMessageResponse;
      return user;
    },

    register: async (_parent: unknown, args: {user: User}) => {
      const response = await axios.post(
        `${process.env.AUTH_URL}/auth/register`,
        args.user
      );
      const user = response.data as LoginMessageResponse;
      return user;
    },

    addUserAsAdmin: async (
      _parent: unknown,
      args: {user: User},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      if (user.isAdmin === false) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const response = await axios.post(
        `${process.env.AUTH_URL}/users`,
        args.user,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const userFromPost = response.data as LoginMessageResponse;
      return userFromPost;
    },

    updateUser: async (
      _parent: unknown,
      args: {user: User},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const response = await axios.put(
        `${process.env.AUTH_URL}/users`,
        args.user,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const userFromPut = response.data as LoginMessageResponse;
      return userFromPut;
    },

    deleteUser: async (
      _parent: unknown,
      _args: unknown,
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const response = await axios.delete(`${process.env.AUTH_URL}/users`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const userFromDelete = response.data as LoginMessageResponse;
      return userFromDelete;
    },

    updateUserAsAdmin: async (
      _parent: unknown,
      args: {user: User; id: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      if (user.isAdmin === false) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const response = await axios.put(
        `${process.env.AUTH_URL}/users/${args.id}`,
        args.user,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const userFromPut = response.data as LoginMessageResponse;
      return userFromPut;
    },

    deleteUserAsAdmin: async (
      _parent: unknown,
      args: {id: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      if (user.isAdmin === false) {
        throw new GraphQLError('You are not an admin', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const response = await axios.delete(
        `${process.env.AUTH_URL}/users/${args.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const userFromDelete = response.data as LoginMessageResponse;
      return userFromDelete;
    },
  },
};
