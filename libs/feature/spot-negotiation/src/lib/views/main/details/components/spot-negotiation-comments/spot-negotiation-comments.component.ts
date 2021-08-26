import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spot-negotiation-comments',
  templateUrl: './spot-negotiation-comments.component.html',
  styleUrls: ['./spot-negotiation-comments.component.css']
})
export class SpotNegotiationCommentsComponent implements OnInit {
  @Input() reqIndex;
  @Input() selectedReqIndex;

  menuOptions = [{ name: "Delete Comments", icon: "../../../assets/customicons/delete-red.svg" }];
  
  commentsJson = [
  {
  internalComments : [
    {
      placeholder: 'YH',
      name: 'Yusuf Hassan',
      date: '13 Dec 2019',
      time: '09:00',
      comment: 'LPB not sent- Quantity to order directly calculated and instructed by Ops. BO calculated around 400MT below quantity validated'
    }],  
  vesselsAgentsComments : [
    {
      placeholder: 'YH',
      name: 'Yusuf Hassan',
      date: '13 Dec 2019',
      time: '09:00',
      comment: 'On arrival to Rotteram on board will be also ~300MT of ULSFO. This stock can\'t be refilled w/out mixing. This fuel will be consumed during ship steaming in SECA.'
    }],
  performanceComments : [
  {
    placeholder: 'YH',
    name: 'Yusuf Hassan',
    date: '13 Dec 2019',
    time: '09:00',
    comment: 'I have checked this plan.'
  }],
  suppliersComments : [
  {
    placeholder: 'YH',
    name: 'Yusuf Hassan',
    date: '13 Dec 2019',
    time: '09:00',
    comment: 'Vessel delay expected by 8hrs.'
  },
  {
    placeholder: 'YH',
    name: 'Yusuf Hassan',
    date: '13 Dec 2019',
    time: '09:00',
    comment: 'PLEASE NOTE VESSEL CAN ONLY TAKE ONE PRODUCT AT A TIME ALL PRODUCTS THROUGH SAME LINE'
  },
  {
    placeholder: 'YH',
    name: 'Yusuf Hassan',
    date: '13 Dec 2019',
    time: '09:00',
    comment: 'BUNKER REQUIERED AT ANCHORE'
  }]
  }];
  newInternalComment = '';
  newVesselComment = '';
  newPerformanceComment = '';
  newSupplierComment = '';
  
  constructor() { }

  ngOnInit(): void {
    var dummy = JSON.parse(JSON.stringify(this.commentsJson[0])); 
    dummy.suppliersComments[0].date = '14 Dec 2019';
    dummy.suppliersComments.push(
      {
        placeholder: 'YH',
        name: 'Yusuf Hassan',
        date: '14 Dec 2019',
        time: '09:00',
        comment: 'Please recheck.'
      }
    )
    this.commentsJson.push(JSON.parse(JSON.stringify(dummy)));

    dummy = JSON.parse(JSON.stringify(this.commentsJson[0]));
    dummy.suppliersComments[0].date = '15 Dec 2019';
    this.commentsJson.push(JSON.parse(JSON.stringify(dummy)));
    // dummy.suppliersComments[0].date = '13 Dec 2019';
  }

  addInternalComment(internalComment){
    if(internalComment){
      this.commentsJson[this.reqIndex].internalComments.push({
        placeholder: 'PB',
        name: 'Pooja Bhattiprolu',
        date: '13 Dec 2019',
        time: '09:00',
        comment: internalComment
      });
      this.newInternalComment = '';
    }
  }

  deleteInternalComment(i){
    this.commentsJson[this.reqIndex].internalComments.splice(i, 1);
  }

  addVesselComment(vesselComment){
    if(vesselComment){
      this.commentsJson[this.reqIndex].vesselsAgentsComments.push({
        placeholder: 'PB',
        name: 'Pooja Bhattiprolu',
        date: '13 Dec 2019',
        time: '09:00',
        comment: vesselComment
      });
      this.newVesselComment = '';
    }
  }

  deleteVesselComment(i){
    this.commentsJson[this.reqIndex].vesselsAgentsComments.splice(i, 1);
  }

  addPerformanceComment(performanceComment){
    if(performanceComment){
      this.commentsJson[this.reqIndex].performanceComments.push({
        placeholder: 'PB',
        name: 'Pooja Bhattiprolu',
        date: '13 Dec 2019',
        time: '09:00',
        comment: performanceComment
      });
      this.newPerformanceComment = '';
    }
  }

  deletePerformanceComment(i){
    this.commentsJson[this.reqIndex].performanceComments.splice(i, 1);
  }

  addSuppliersComment(suppliersComment){
    if(suppliersComment){
      this.commentsJson[this.reqIndex].suppliersComments.push({
        placeholder: 'PB',
        name: 'Pooja Bhattiprolu',
        date: '13 Dec 2019',
        time: '09:00',
        comment: suppliersComment
      });
      this.newSupplierComment = '';
    }
  }

  deleteSupplierComment(i){
    this.commentsJson[this.reqIndex].suppliersComments.splice(i, 1);
    this.seletedItem = null;
  }

  copyComments(){
    if(this.selectedReqIndex.length>0 && this.seletedItem!=null){
      this.selectedReqIndex.forEach(element => {
        this.seletedItem.msg.selected = false;

        if(this.commentsJson[element] == null){
          this.commentsJson[element] = {
            internalComments:null,
            vesselsAgentsComments:null,
            performanceComments:null,
            suppliersComments:null
          };
          this.commentsJson[element][this.seletedItem.msgcategory]=[];
          this.commentsJson[element][this.seletedItem.msgcategory].push(this.seletedItem.msg);
        }
        else if(this.commentsJson[element][this.seletedItem.msgcategory]!=null){
          this.commentsJson[element][this.seletedItem.msgcategory].push(this.seletedItem.msg);
        }
        else{
          this.commentsJson[element][this.seletedItem.msgcategory]=[];
          this.commentsJson[element][this.seletedItem.msgcategory].push(this.seletedItem.msg);
        }
      });
      this.seletedItem = null;
    }
  }

  seletedComments=[];
  seletedItem = null;
  selectItem(msgCategory, index){    
    var msgCat = msgCategory == 0 ? 'internalComments': msgCategory == 1 ? 'performanceComments': msgCategory == 2 ?'suppliersComments':msgCategory == 3 ? 'vesselsAgentsComments':null;
    if(msgCat){     
        var copymsg = this.commentsJson[this.reqIndex][msgCat][index];
        var msg = {
          reqindex:this.reqIndex,
          msgcategory:msgCat,
          msgindex:index,
          msg:copymsg
        }
        if(this.commentsJson[this.reqIndex][msgCat][index]['selected']){
          this.commentsJson[this.reqIndex][msgCat][index].selected = false;
          this.seletedItem = null
        }

        if(this.seletedItem!=null){
          this.commentsJson[this.seletedItem.reqindex][this.seletedItem.msgcategory][this.seletedItem.msgindex]['selected'] = false;
          this.seletedItem = null;
          this.commentsJson[this.reqIndex][msgCat][index]['selected'] = true;  
          this.seletedItem = msg;
        }
        else{
          this.commentsJson[this.reqIndex][msgCat][index]['selected'] = true;  
          this.seletedItem = msg;
        }
        // else if(this.seletedItem!=null && this.seletedItem.reqindex!=this.reqIndex && this.seletedItem.msgcategory!=msgCategory && this.seletedItem.msgindex!=index){       
        
    }
  }

}
