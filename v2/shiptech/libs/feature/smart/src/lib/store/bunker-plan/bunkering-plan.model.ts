  export class SaveBunkeringPlanModel{
    plan_id: string;
    detail_no: number;
    port_id: string;
    service_code: string;
    operator_ack: any;
    hsfo_max_lift: number;
    hsfo_estimated_consumption: number;
    hsfo_safe_port: number;
    eca_estimated_consumption: number;
    eca_safe_port: number;
    ulsfo_max_lift: number;
    lsdis_max_lift: number;
    lsdis_estimated_consumption: number;
    lsdis_safe_port: number;
    hsfo_min_sod: number;
    eca_min_sod: number;
    min_sod: number;
    max_sod: number;
    hsdis_estimated_lift: number;
    business_address: string;
    is_min_soa: any;
    min_soa_comment: string;
    min_sod_comment: string;
    hsfo_sod_comment: string;
    eca_sod_comment: string;
    max_sod_comment: string;

  }

  export class CurrentROBModel{
    '3.5 QTY': number;
    '0.5 QTY': number;
    'ULSFO': number;
    'LSDIS': number;
    'HSDIS': number;
  }
  