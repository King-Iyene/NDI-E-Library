import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "super_admin" | "admin" | "student";
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "super_admin" | "admin" | "student";
    id: string;
  }
}
