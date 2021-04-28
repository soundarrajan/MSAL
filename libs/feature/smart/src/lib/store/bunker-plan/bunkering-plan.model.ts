export class BunkeringPlanDetailsModel {
  operAck : boolean;
  portCode : string;
  
  hsfoMaxLift : number;
  hsfoEstdSoa : number;
  hsfoEstdCons : number;
  hsfoConfPlanLift : number;
  hsfoSafePort : number;
  
  ecaEstdCons : number;
  ecaSafePort : number;
  
  ulsfoMaxLift : number;
  ulsfoEstdSoa : number;
  ulsfoConfPlanLift : number;
  
  lsdisMaxLift : number;
  lsdisEstdSoa : number;
  lsdisEstdCons : number;
  lsdisConfPlanLift : number;
  lsdisSafePort : number;

  totalMinSod : number;
  totalMinSodPort : string;
  totalMinSodComments : string;
  minHsfoSod : number;
  minHsfoSodPort : string;
  minHsfoSodComment : string;
  minEcaBunkerSod : number;
  minEcaBunkerSodPort : string;
  minEcaBunkerSodComment : string; 
  totalMaxSod : number;
  totalMaxSodPort : string;
  totalMaxSodComment : string;    
  hsdisConfReqLift : number;
  businessAddress : string;
  minSoa : boolean;
  minSoaPort : string;
  minSoaComment : string;
  reqCreated : boolean;
  confirmedByVessel : boolean;
  confirmedByBox : boolean;
  
    constructor(props: Partial<IBunkeringPlanDetailsState> = {}) {
      const  decodeHtmlEntity = function(str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });
      };
    //   if (props) {
    //     props.comment = props.comment ? decodeHtmlEntity(_.unescape(props.comment)) : '';
    //   }
    //   if (props.vesselResponse) {
    //     props.vesselResponse.sludge.description = props.vesselResponse.sludge.description ? decodeHtmlEntity(_.unescape(props.vesselResponse.sludge.description)) : '';
    //     props.vesselResponse.bunker.description = props.vesselResponse.bunker.description ? decodeHtmlEntity(_.unescape(props.vesselResponse.bunker.description)) : '';
    //   }
    //   if (props.uoms){
    //     for (let i = 0; i < props.uoms.length; i++) {
    //       props.uoms[i].name =  decodeHtmlEntity(_.unescape(props.uoms[i].name));
    //       props.uoms[i].displayName = decodeHtmlEntity(_.unescape(props.uoms[i].displayName));
    //     }
    //   }
    //   if (props.vessel) {
    //     props.vessel.name = decodeHtmlEntity(_.unescape(props.vessel.name));
    //   }
      Object.assign(this, props);
    }
  
  }
  
  export interface IBunkeringPlanDetailsState extends BunkeringPlanDetailsModel {}