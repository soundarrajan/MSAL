﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore;
using Shiptech.Negotiation.Domain.Data.EfCore;
using Shiptech.Negotiation.Domain.Data.Model;
using System;


namespace Shiptech.Negotiation.Domain.Data.EfCore.Configurations
{
    public partial class RequestProductScreenActionConfiguration : IEntityTypeConfiguration<RequestProductScreenAction>
    {
        public void Configure(EntityTypeBuilder<RequestProductScreenAction> entity)
        {
            entity.HasKey(e => new { e.RequestProductId, e.ScreenActionId })
                .HasName("PK_procurement.RequestProductScreenActions");

            entity.ToTable("RequestProductScreenActions", "procurement");

            entity.HasIndex(e => e.RequestProductId, "IX_RequestProductId");

            entity.HasIndex(e => e.ScreenActionId, "IX_ScreenActionId");

            entity.HasOne(d => d.RequestProduct)
                .WithMany(p => p.RequestProductScreenActions)
                .HasForeignKey(d => d.RequestProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_procurement.RequestProductScreenActions_procurement.RequestProducts_RequestProductId");

            OnConfigurePartial(entity);
        }

        partial void OnConfigurePartial(EntityTypeBuilder<RequestProductScreenAction> entity);
    }
}
