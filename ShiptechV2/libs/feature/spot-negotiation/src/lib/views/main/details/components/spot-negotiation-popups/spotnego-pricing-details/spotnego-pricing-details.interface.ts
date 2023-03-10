export interface FormValues{
    name?: string;
    id?: number;
    comment?: string;
    contractId?: number;
    createdOn?: Date;
    isContractReference?: boolean;
    isDeleted?: boolean;
    isEditable?: boolean;
    isMean?: boolean;
    simpleFormula?: SimpleFormula;
    complexFormulaQuoteLines? : ComplexFormula[];
    pricingSchedule?: PricingSchedule;
    formulaHolidayRules?: FormulaHolidayRule;
    pricingScheduleOptionDateRange? : PricingScheduleOptionDateRange;
    pricingScheduleOptionSpecificDate? : PricingScheduleOptionSpecificDate;
    pricingScheduleOptionEventBasedSimple ?: PricingScheduleOptionEventBasedSimple;
    pricingScheduleOptionEventBasedContinuous? : PricingScheduleOptionEventBasedContinuous;
    pricingScheduleOptionEventBasedExtended? : PricingScheduleOptionEventBasedExtended;
    productDiscountRules?: [];
    quantityDiscountRules?: [];
    locationDiscountRules?: [];
    formulaType?: event ;
    currency?: event
    conversionRate?: number,
    conversionVolumeUomId? : number
}

export interface PricingScheduleOptionHolidayRule{
    id?: number;
    name?: string;
    assumeHolidayOnInstruments?: boolean;
    fridayHolidayRule?: event;
    mondayHolidayRule?: event;
    saturdayHolidayRule?: event;
    sundayHolidayRule?: event;
    thursdayHolidayRule?: event;
    tuesdayHolidayRule?: event;
    wednesdayHolidayRule?: event;
}
export interface PricingScheduleOptionDateRange extends PricingScheduleOptionHolidayRule {
   from: string,
   to: string, 
   allowsPricingOnHoliday: boolean
}

export interface PricingScheduleOptionSpecificDate extends PricingScheduleOptionHolidayRule{
    allowsPricingOnHoliday: boolean
    dates: SpecificDateDatesDto[]
}

export interface SpecificDateDatesDto {
    date: string
    comment?: string
}
export interface PricingScheduleOptionEventBasedSimple extends PricingScheduleOptionHolidayRule {
    fromBusinessCalendarId?: event;
    toBusinessCalendar?: event;
    fromNoOfBusinessDaysBefore ?: string;
    toNoOfBusinessDaysAfter?: string;
    isDeleted?: boolean;
    isEventIncluded?: event;
    event?: event;
}

export interface PricingScheduleOptionEventBasedExtended extends PricingScheduleOptionHolidayRule, PricingScheduleOptionEventBasedSimple {
    excludeFromNoOfBusinessDaysBefore: number
    excludeToNoOfBusinessDaysAfter: number
    fromBusinessCalendar?: event;
 }

 export interface PricingScheduleOptionEventBasedContinuous extends PricingScheduleOptionHolidayRule {
    period: event,
    event: event,
    weekStartsOn: event
 }
export interface event{
    id?: number;
    isDeleted?: boolean;
    name?: string;
}
export interface SimpleFormula  {
    id?: number;
    amount?: number;
    flatPercentage?: FlatPercentage;
    isDeleted?: boolean;
    plusMinus?: FlatPercentage;
    priceType ?: FlatPercentage;
    systemInstrument ?:FlatPercentage ;
    uom?: event;
}
export interface ComplexFormula{
    id?: number;
    amount?: number;
    formulaFlatPercentage: event;
    formulaFunction: event;
    formulaOperation : event;
    formulaPlusMinus :event;
    systemInstruments : SystemInstruments[];
    uom : event;
    weight?: number;
}
export interface PricingSchedule{
    id?: number;
    isDeleted?: boolean;
    name?: string;
}
export interface FormulaHolidayRule{
    id?: number;
    name?: string;
    assumeHolidayOnInstruments?: boolean;
    isDeleted?: boolean;
    mondayHolidayRule?: event;
    tuesdayHolidayRule?: event;
    wednesdayHolidayRule?: event;
    thursdayHolidayRule?: event;
    fridayHolidayRule?: event;
    saturdayHolidayRule?: event;
    sundayHolidayRule?:event
}
export interface FlatPercentage{
  id ?: number;
  name ?: string;
}
export interface SystemInstruments{
    id?: number;
    isDeleted? : boolean;
    complexFormulaQuoteLine ?: event;
    marketPriceTypeId?:  event;
    systemInstrument? : FlatPercentage
}

export interface IdNameModelDto{
    id?: number
    name?: string
}
export interface OfferPriceFormulaDto extends IdNameModelDto{
    requestOfferId: number
    comment?: string
    isEditable?: boolean
    formula: FormulaDto
    schedule: PricingScheduleDto
    discountRules: DiscountRulesDto
    conversionMassUomId: number
    conversionValue: number
    conversionVolumeUomId: number
}

export interface FormulaDto{
    formulaTypeId? : number
    isMean: boolean
    currencyId: number
    simpleFormula: SimpleFormulaDto
    complexFormulaQuoteLines : ComplexFormulaQuoteLinesDto[]
    holidayRule : HolidayRuleDto
}

export interface SimpleFormulaDto  {
    systemInstrumentId: number
    marketPriceTypeId: number
    formulaPlusMinusId: number
    amount: number
    formulaFlatPercentageId: number
    uomId: number
    systemInstrument: IdNameModelDto
    marketPriceType : IdNameModelDto
}

export interface ComplexFormulaQuoteLinesDto{
    amount: number
    formulaFlatPercentageId: number
    formulaFunctionId: number
    formulaOperationId : number
    formulaPlusMinusId : number
    systemInstruments : SystemInstrumentDto[]
    uomId : number
    weight: number
}

export interface SystemInstrumentDto{
    marketPriceTypeId:  number
    systemInstrumentId: number
}

export interface HolidayRuleDto{
    name?: string,
    assumeHolidayOnInstruments?: boolean
    mondayHolidayRuleId : number
    tuesdayHolidayRuleId : number
    wednesdayHolidayRuleId : number
    thursdayHolidayRuleId : number
    fridayHolidayRuleId : number
    saturdayHolidayRuleId : number
    sundayHolidayRuleId : number
}

export interface PricingScheduleDto{
    pricingScheduleId : number
    dateRange? : DateRangeDto
    specificDate? : SpecificDateDto
    eventBasedSimple? : EventBasedSimpleDto
    eventBasedExtended? : EventBasedExtendDto
    eventBasedContinuous? : EventBasedContinuousDto
}

export interface DateRangeDto extends HolidayRuleDto{
    validFrom: string,
    validTo: string,
    allowsPricingOnHoliday: boolean
}

export interface SpecificDateDto extends HolidayRuleDto{
    allowsPricingOnHoliday: boolean
    dates: SpecificDateDatesDto[]
}

export interface SpecificDateDatesDto {
    date: string
    comment?: string
}

export interface EventBasedSimpleDto extends HolidayRuleDto{
    fromNoOfBusinessDaysBefore ?: string
    toNoOfBusinessDaysAfter?: string
    fromBusinessCalendarId?: number
    toBusinessCalendarId?: number 
    isEventIncludedId: number
    eventId: number
}

export interface EventBasedExtendDto extends HolidayRuleDto, EventBasedSimpleDto{
    excludeFromNoOfBusinessDaysBefore: number
    excludeToNoOfBusinessDaysAfter: number
}

export interface EventBasedContinuousDto extends HolidayRuleDto {
    pricingSchedulePeriodId: number,
    eventId: number,
    weekStartsOn: number
}

export interface DiscountRulesDto{
    plusMinusId: number
    plusMinus: IdNameModelDto
    flatPercentageId: number
    flatPercentage: IdNameModelDto
    amount: number
    uomId: number
    uom: IdNameModelDto 
}
export interface QuantityDiscountRulesDto extends DiscountRulesDto{
    quantityTypeId: number
    quantityType: IdNameModelDto
    quantityRangeFrom: number
    quantityRangeTo: number
}
export interface ProductDiscountRulesDto extends DiscountRulesDto {
    productId: number
    product: IdNameModelDto
}
export interface LocationDiscountRulesDto extends DiscountRulesDto {
    locationId: number
    location: IdNameModelDto
}

export interface DiscountRulesDto{
    quantityDiscountRules?: number[]
    productDiscountRules? : number[]
    locationDiscountRules? : number[]
}
