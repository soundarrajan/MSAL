﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore;
using Shiptech.Negotiation.Domain.Data.EfCore;
using Shiptech.Negotiation.Domain.Data.Model;
using System;


namespace Shiptech.Negotiation.Domain.Data.EfCore.Configurations
{
    public partial class RfqConfiguration : IEntityTypeConfiguration<Rfq>
    {
        public void Configure(EntityTypeBuilder<Rfq> entity)
        {
            entity.ToTable("Rfqs", "rfq");

            entity.HasIndex(e => e.StatusId, "IX_StatusId");

            entity.HasIndex(e => e.Name, "RfqsNameIdx")
                .IsUnique();

            entity.Property(e => e.CreatedOn).HasColumnType("datetime");

            entity.Property(e => e.CustomNonMandatoryAttribute1).HasMaxLength(500);

            entity.Property(e => e.CustomNonMandatoryAttribute2).HasMaxLength(500);

            entity.Property(e => e.CustomNonMandatoryAttribute3).HasMaxLength(500);

            entity.Property(e => e.CustomNonMandatoryAttribute4).HasColumnType("datetime");

            entity.Property(e => e.CustomNonMandatoryAttribute5).HasColumnType("datetime");

            entity.Property(e => e.CustomNonMandatoryAttribute6).HasColumnType("datetime");

            entity.Property(e => e.CustomNonMandatoryAttribute7).HasColumnType("decimal(18, 3)");

            entity.Property(e => e.CustomNonMandatoryAttribute8).HasColumnType("decimal(18, 3)");

            entity.Property(e => e.CustomNonMandatoryAttribute9).HasColumnType("decimal(18, 3)");

            entity.Property(e => e.DmRfqid)
                .HasMaxLength(100)
                .HasColumnName("DM_RFQId");

            entity.Property(e => e.LastModifiedOn).HasColumnType("datetime");

            entity.Property(e => e.Name)
                .HasMaxLength(54)
                .HasComputedColumnSql("('RFQ '+CONVERT([nvarchar](50),[Id]))", true);

            entity.Property(e => e.QuoteByDate).HasColumnType("datetime");

            entity.HasOne(d => d.RequestLocationSeller)
                .WithMany(p => p.Rfqs)
                .HasForeignKey(d => d.RequestLocationSellerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_rfq.Rfqs_rfq.RequestLocationSellers_RequestLocationSellerId");

            OnConfigurePartial(entity);
        }

        partial void OnConfigurePartial(EntityTypeBuilder<Rfq> entity);
    }
}
