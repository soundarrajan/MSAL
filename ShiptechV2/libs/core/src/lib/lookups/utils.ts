import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export function fromLegacyLookup<TId = number, TName = string>(
  legacy: IDisplayLookupDto<TId, TName>
): IDisplayLookupDto<TId, TName> {
  if (!legacy) return legacy;

  return {
    id: legacy.id,
    name: legacy.name,
    displayName: (legacy.displayName || legacy.name)?.toString()
  };
}
