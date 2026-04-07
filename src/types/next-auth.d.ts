import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id:          string;
    status:      string;
    role:        string;
    accessToken: string;
  }
  interface Session {
    user: {
      id:          string;
      email:       string;
      name?:       string | null;
      image?:      string | null;
      status:      string;
      role:        string;
      accessToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:          string;
    status:      string;
    role:        string;
    accessToken: string;
  }
}
