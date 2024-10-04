using System.Diagnostics.Eventing.Reader;
using System.Globalization;
using System.Net.NetworkInformation;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ejercicios
{
	#region Gestor de Tareas
	public class listado_tarea : alta_tarea
	{
		public int Id { get; set; }
	}
	public class alta_tarea : editar_tarea
	{
		public DateTime fecha_creacion { get; set; }
	}
	public class editar_tarea
	{
		public string titulo { get; set; }
		public string descripcion { get; set; }
		public bool estado { get; set; }
	}
	#endregion Gestor de Tareas
	#region Sistema de Reservas de Sala de Reuniones
	public class listado_sala : alta_sala
	{
		public int Id { get; set; }
		public List<listar_reservacion> reservaciones {  get; set; }
	}
	public class alta_sala : editar_sala
	{
		public DateTime fecha_creacion { get; set; }
	}
	public class editar_sala {
		public string nombre_sala {  get; set; }
		public int capacidad { get; set; }
		public bool estado { get; set; }
	}
	public class alta_reservacion:listar_reservacion
	{
		public int id_sala { get; set; }
		
	}
	public class listar_reservacion {
		public int id { get; set; }
		public DateTime fecha_inicio { get; set; }
		public DateTime fecha_fin { get; set; }
	}
	#endregion Sistema de Reservas de Sala de Reuniones
}