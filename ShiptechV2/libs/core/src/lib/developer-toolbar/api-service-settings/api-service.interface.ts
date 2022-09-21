export interface IApiService {
  id: string;
  displayName: string;
  instance: any;
  isRealService: boolean;
  suppressUrls?: boolean;
  localApiUrl?: string;
  devApiUrl?: string;
  qaApiUrl?: string;
}
