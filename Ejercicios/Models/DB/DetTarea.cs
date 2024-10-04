using System;
using System.Collections.Generic;

namespace Ejercicios.Models.DB;

public partial class DetTarea
{
    public int Id { get; set; }

    public string TituloTarea { get; set; } = null!;

    public string Descripcion { get; set; } = null!;

    public bool Estado { get; set; }

    public DateTime FechaCreacion { get; set; }

    public DateTime FechaModificacion { get; set; }
}
