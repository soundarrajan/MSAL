import * as _ from 'lodash';
import { IUserSettingResponse } from './request-response';

export function getFilterModels(n: number = 5): any {
  const presets = [
    ..._.range(1, n).map(() => ({
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5),
      dateTo: null,
      dateFrom: '2019-01-20',
      type: 'equals',
      filterType: 'date'
    }))
  ];

  return _.keyBy(presets, 'id');
}

export const mockFilterPresets = (
  groupId: string,
  gridName: string
): IUserSettingResponse => {
  const value = {
    [groupId]: [
      {
        id: groupId + '123123123',
        name: 'test',
        filterModels: { [gridName]: getFilterModels() },
        isPinned: true,
        canPin: false,
        isActive: true
      }
    ]
  };

  return { value };
};

export function getFilterPresets(n: number = 5): any[] {
  return [
    ..._.range(1, n).map(id => ({
      [id]: [
        {
          id: id + '123123123',
          name: 'test',
          filterModels: {
            [Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, '')
              .substr(0, 5)]: getFilterModels()
          },
          isPinned: true,
          canPin: false,
          isActive: false
        }
      ]
    }))
  ];
}

export const mockFilterPresetsList = (n: number = 5): IUserSettingResponse => {
  const value = getFilterPresets(n);
  return { value };
};
