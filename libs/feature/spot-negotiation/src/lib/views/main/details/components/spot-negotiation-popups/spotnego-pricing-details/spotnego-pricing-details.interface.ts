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
    pricingScheduleOptionDateRange?;
    pricingScheduleOptionEventBasedContinuous?;
    pricingScheduleOptionEventBasedExtended?;
    pricingScheduleOptionEventBasedSimple ?: PricingScheduleOptionEventBasedSimple;
    pricingScheduleOptionSpecificDate?;
    productDiscountRules?: [];
    quantityDiscountRules?: [];
    formulaType?: event ;
}

export interface PricingScheduleOptionEventBasedSimple{
    id?: number;
    name?: string;
    assumeHolidayOnInstruments?: boolean;
    event?: event;
    fridayHolidayRule?: event;
    fromBusinessCalendarId?: event;
    fromNoOfBusinessDaysBefore ?: number;
    toNoOfBusinessDaysAfter?: number;
    isDeleted?: boolean;
    isEventIncluded?: event;
    mondayHolidayRule?: event;
    saturdayHolidayRule?: event;
    sundayHolidayRule?: event;
    thursdayHolidayRule?: event;
    toBusinessCalendar?: event;
    tuesdayHolidayRule?: event;
    wednesdayHolidayRule?: event;
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
