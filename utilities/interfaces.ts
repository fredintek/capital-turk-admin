export interface CurrentUserObj {
  profilePicture: {
    public_id: string;
    url: string;
  };
  _id: string;
  email: string;
  role: string;
  username: string;
}

export type LoginResponse = {
  token: string;
  user: Partial<CurrentUserObj>;
};
