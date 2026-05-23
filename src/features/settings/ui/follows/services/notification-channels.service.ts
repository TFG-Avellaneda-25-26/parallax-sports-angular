import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@shared/api';
import {
  NotificationChannelKey,
  SportNotificationChannels,
  UpdateNotificationChannelRequest,
} from '../models/notification-channel.model';

@Injectable({ providedIn: 'root' })
export class NotificationChannelsService {
  private readonly api = inject(ApiClient);

  list() {
    return this.api.get<SportNotificationChannels[]>('/api/users/notification-channels');
  }

  upsert(sportId: number, channel: NotificationChannelKey, body: UpdateNotificationChannelRequest) {
    return this.api.put<void>(`/api/users/notification-channels/${sportId}/${channel}`, body);
  }

  remove(sportId: number, channel: NotificationChannelKey) {
    return this.api.delete<void>(`/api/users/notification-channels/${sportId}/${channel}`);
  }
}
