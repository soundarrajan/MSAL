export interface NotificationModel {
  NotificationId: number;
  EntityType: string;
  EntityId: number;
  AlertName: string;
  Message: string;
  ColorFlag: number;
  Latitude: number;
  Longitude: number;
  LastUpdatedDate: string;
}
