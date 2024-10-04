using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Ejercicios.Models.DB;

public partial class EjercicioContext : DbContext
{
    public EjercicioContext()
    {
    }

    public EjercicioContext(DbContextOptions<EjercicioContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CatSala> CatSalas { get; set; }

    public virtual DbSet<DetReunion> DetReunions { get; set; }

    public virtual DbSet<DetTarea> DetTareas { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost; Database=Ejercicio; Trusted_Connection=True; Encrypt=True; TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CatSala>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_id_cat_sala");

            entity.ToTable("cat_sala");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Capacidad).HasColumnName("capacidad");
            entity.Property(e => e.Estado).HasColumnName("estado");
            entity.Property(e => e.FechaCreacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_creacion");
            entity.Property(e => e.FechaModificacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_modificacion");
            entity.Property(e => e.NombreSala)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("nombre_sala");
        });

        modelBuilder.Entity<DetReunion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_id_det_reunion");

            entity.ToTable("det_reunion");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Activo).HasColumnName("activo");
            entity.Property(e => e.FechaCreacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_creacion");
            entity.Property(e => e.FechaFinReunion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_fin_reunion");
            entity.Property(e => e.FechaInicioReunion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_inicio_reunion");
            entity.Property(e => e.FechaModificacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_modificacion");
            entity.Property(e => e.IdSala).HasColumnName("id_sala");

            entity.HasOne(d => d.IdSalaNavigation).WithMany(p => p.DetReunions)
                .HasForeignKey(d => d.IdSala)
                .HasConstraintName("FK_id_sala");
        });

        modelBuilder.Entity<DetTarea>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_id_det_tarea");

            entity.ToTable("det_tarea");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Estado).HasColumnName("estado");
            entity.Property(e => e.FechaCreacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_creacion");
            entity.Property(e => e.FechaModificacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_modificacion");
            entity.Property(e => e.TituloTarea)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("titulo_tarea");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
