export interface IBunkeringPlanDetailsInterface{
    operator_ack : boolean;
    port : string;
    hsfo_max_lift : number;
    hsfo_estd_soa : number;
    hsfo_estd_cons : number;
    hasfo_plan_lift : number;
    hsfo_safe_port : number;
    seca_estd_cons : number;
    seca_safe_port : number;
    ulsfo_max_lift_wo : number;
    ulsfo_estd_soa : number;
    ulsfo_plan_lift : number;
    lsdis_max_lift : number;
    lsdis_estd_soa : number;
    lsdis_estd_cons : number;
    lsdis_plan_lift : number;
    lsdis_safe_port : number;
    total_min_sod : IFieldPopupValues;
    min_hsfo_sod : IFieldPopupValues;
    min_eca_bunker_sod : IFieldPopupValues;
    total_max_sod : IFieldPopupValues;
    req_lift : number;
    email : string;
    min_soa : IFieldPopupBooleanValues;
    req_created : boolean;
    confirmed_by_vessel : boolean;
    confirmed_by_box : boolean;

}

export interface IFieldPopupBooleanValues {
    port : string;
    value : boolean;
    comments : string;
}

export interface IFieldPopupValues {
    port : string;
    value : number;
    comments : string;
}