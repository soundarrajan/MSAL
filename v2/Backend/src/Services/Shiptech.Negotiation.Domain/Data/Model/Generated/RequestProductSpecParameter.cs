﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace Shiptech.Negotiation.Domain.Data.Model
{
    public partial class RequestProductSpecParameter
    {
        public long Id { get; set; }
        public long RequestProductId { get; set; }
        public long SpecGroupId { get; set; }
        public long SpecParameterId { get; set; }
        public double? Min { get; set; }
        public double? Max { get; set; }
        public bool IsDeleted { get; set; }

        public virtual RequestProduct RequestProduct { get; set; }
    }
}