export interface ApiResponse<T> {
    data: {
    id: string;
    type: string;
    attributes: T;
  }[];
}
