using System;
using System.Collections.Generic;

namespace Ejercicios.Models.DB;

public partial class CatSala
{
    public int Id { get; set; }

    public string NombreSala { get; set; } = null!;

    public int Capacidad { get; set; }

    public bool Estado { get; set; }

    public DateTime FechaCreacion { get; set; }

    public DateTime FechaModificacion { get; set; }

    public virtual ICollection<DetReunion> DetReunions { get; set; } = new List<DetReunion>();
}
