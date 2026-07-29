export interface IUpdateBookDTO {
  id: string;
  copies: number;
  synopsis?: string;
}

export interface IUploadImageBookDTO {
  image: { path: string };
  id: string;
}
