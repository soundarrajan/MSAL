export enum ErrorCode {
  Unknown = 0,

  LoadControlTowerQuantityRobDifferenceFailed = 100,
  LoadControlTowerQuantitySupplyDifferenceFailed = 101,

  LoadControlTowerQuantityClaimsFailed = 102,
  LoadControlTowerQuantitySupplyDifferencePopupFailed = 102,

  LoadControlTowerResidueSludgeDifferenceFailed = 103,
  LoadControlTowerResidueEGCSDifferenceFailed = 107,

  LoadControlTowerQualityClaimsFailed = 104,
  LoadControlTowerQualityLabsFailed = 105,
  LoadControlTowerQualityLabsPopupFailed = 106
}
