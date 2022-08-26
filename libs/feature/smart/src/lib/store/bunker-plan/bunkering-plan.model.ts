  export class SaveBunkeringPlanModel{
    business_address: string;
    clientIpAddress: any;
    detail_no: number;
    eca_estimated_consumption: number;
    eca_min_sod: number;
    eca_reserve: number;
    eca_safe_port: number;
    eca_sod_comment: string;
    gsis_id: string;
    hsdis_estimated_lift: number;
    hsfo05_stock: number;
    hsfo_est_consumption_color: any;
    hsfo_estimated_consumption: number;
    hsfo_estimated_lift: number;
    hsfo_max_lift: number;
    hsfo_max_lift_color: any;
    hsfo_min_sod: number;
    hsfo_reserve: number;
    hsfo_safe_port: number;
    hsfo_soa: number;
    hsfo_sod_comment: string;
    is_end_of_service: any;
    is_alt_port: any;
    is_min_soa: number;
    is_new_port: any;
    location_id: any;
    location_name: string;
    lsdis_as_eca: number;
    lsdis_est_consumption_color: any;
    lsdis_estimated_consumption: number;
    lsdis_estimated_lift: number;
    lsdis_max_lift: number;
    lsdis_max_lift_color: any;
    lsdis_reserve: number;
    lsdis_safe_port: number;
    lsdis_soa: number;
    max_sod: number;
    max_sod_comment: string;
    min_soa_comment: string;
    min_sod: number;
    min_sod_comment: string;
    modulePathUrl: any;
    mpo_ulsfo_estimated_lift: number;
    mpo_ulsfo_soa: number;
    op_updated_columns: string;
    operator_ack: number;
    order_id_hsdis: any;
    order_id_hsfo: any;
    order_id_lsdis: any;
    order_id_ulsfo: any;
    plan_id: string;
    port_id: string;
    redelivery_port: any;
    request_id_hsdis: any;
    request_id_hsfo: any;
    request_id_lsdis: any;
    request_id_ulsfo: any;
    request_id_vlsfo: any;
    service_code: string;
    total_tank_capacity: number;
    ulsfo_est_consumption_color: any;
    ulsfo_estimated_lift: number;
    ulsfo_max_lift: number;
    ulsfo_max_lift_color: any;
    ulsfo_soa: number;
    userAction: any;
    vessel_ack: number;
    voyage_detail_id: any;
  }

  export class CurrentROBModel{
    '3.5 QTY': number;
    '0.5 QTY': number;
    'ULSFO': number;
    'LSDIS': number;
    'HSDIS': number;
    'hsfoTankCapacity': number;
    'ulsfoTankCapacity': number;
    'lsdisTankCapacity': number;
    'hsdisTankCapacity': number;
    'upulsfo': number;
    'uplsdis' : number;
  }
  