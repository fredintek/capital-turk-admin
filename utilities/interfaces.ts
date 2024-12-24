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
  data: {
    token: string;
    user: Partial<CurrentUserObj>;
  };
  status: string;
  message: string;
};

export type FunResponseDataImage = {
  public_id: string | null;
  url: string | null;
};

export type FunResponseData = {
  image: FunResponseDataImage | null | undefined;
  _id: string;
  time: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface FunResponse {
  status: string;
  message: string;
  data: FunResponseData[];
}
