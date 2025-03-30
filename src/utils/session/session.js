import { withIronSession } from 'next-iron-session';

export default function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.COOKIE_PASSWORD, // Change this to your secret
    cookieName: 'userInfo',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}
