using System;
using System.Collections.Generic;

namespace Ejercicios.Models.DB;

public partial class DetReunion
{
    public int Id { get; set; }

    public int IdSala { get; set; }

    public DateTime FechaInicioReunion { get; set; }

    public DateTime FechaFinReunion { get; set; }

    public bool Activo { get; set; }

    public DateTime FechaCreacion { get; set; }

    public DateTime FechaModificacion { get; set; }

    public virtual CatSala IdSalaNavigation { get; set; } = null!;
}
