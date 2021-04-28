//B Plan grid column header names defined.

//B plan column groups
export enum BunkeringPlanColmGroups{
    Port = 'Port',
    Hsfo = 'Hsfo',
    EcaCompliant = 'EcaCompliant',
    Eca = 'Eca',
    Ulsfo = 'Ulsfo',
    Lsdis = 'Lsdis',
    Others = 'Others'
}

export enum BunkeringPlanColmGroupLabels{
    Port = '',
    Hsfo = 'HSFO',
    EcaCompliant = 'ECA COMPLIANT',
    Eca = 'ECA',
    Ulsfo = 'ULSFO',
    Lsdis = 'LSDIS',
    Others = ''
}

//B plan columns
export enum BunkeringPlanColumns{
    OperAck = 'OperAck',
    PortCode = 'PortCode',
    
    HsfoMaxLift = 'HsfoMaxLift',
    HsfoEstdSoa = 'HsfoEstdSoa',
    HsfoEstdCons = 'HsfoEstdCons',
    HsfoConfPlanLift = 'HsfoConfPlanLift',
    HsfoSafePort = 'HsfoSafePort',
    
    EcaEstdCons = 'EcaEstdCons',
    EcaSafePort = 'EcaSafePort',
    
    UlsfoMaxLift = 'UlsfoMaxLift',
    UlsfoEstdSoa = 'UlsfoEstdSoa',
    UlsfoConfPlanLift = 'UlsfoConfPlanLift',
    
    LsdisMaxLift = 'LsdisMaxLift',
    LsdisEstdSoa = 'LsdisEstdSoa',
    LsdisEstdCons = 'LsdisEstdCons',
    LsdisConfPlanLift = 'ConfPlanLift',
    LsdisSafePort = 'LsdisSafePort',

    TotalMinSod = 'TotalMinSod',
    MinHsfoSod = 'MinHsfoSod',
    MinEcaBunkerSod = 'MinEcaBunkerSod',
    TotalMaxSod = 'TotalMaxSod',
    HsdisConfReqLift = 'HsdisConfReqLift',
    BusinessAddress = 'BusinessAddress',
    MinSoa = 'MinSoa'
}

export enum BunkeringPlanColumnsLabels {
    OperAck = 'Oper. Ack.',
    PortCode = 'PortCode',
    
    HsfoMaxLift = 'Max Lift',
    HsfoEstdSoa = 'Estd. SOA',
    HsfoEstdCons = 'Estd. Cons',
    HsfoConfPlanLift = 'Conf/ Plan Lift',
    HsfoSafePort = 'Safe Port',
    
    EcaEstdCons = 'Estd. Cons',
    EcaSafePort = 'Safe Port',
    
    UlsfoMaxLift = 'Max Lift',
    UlsfoEstdSoa = 'Estd. SOA',
    UlsfoConfPlanLift = 'Conf/ Plan Lift',
    
    LsdisMaxLift = 'Max Lift',
    LsdisEstdSoa = 'Estd. SOA',
    LsdisEstdCons = 'Estd. Cons',
    LsdisConfPlanLift = 'Conf/ Plan Lift',
    LsdisSafePort = 'LSDIS Safe Port',

    TotalMinSod = 'Total Min SOD',
    MinHsfoSod = 'Min HSFO SOD',
    MinEcaBunkerSod = 'Min ECA Bunker SOD',
    TotalMaxSod = 'Total Max SOD',
    HsdisConfReqLift = 'HSDIS Conf/ Req Lift',
    BusinessAddress = 'Business Address',
    MinSoa = 'Min SOA'
  }
  
  