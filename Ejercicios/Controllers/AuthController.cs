using Ejercicios.Models.DB;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO.Compression;
using System.Net.NetworkInformation;
using System.Numerics;
using System.Security.Claims;
using System.Threading;
using static System.Runtime.InteropServices.JavaScript.JSType;
//Scaffold-DbContext "Server=localhost; Database=Ejercicio; Trusted_Connection=True; Encrypt=True; TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models/DB -Force

namespace Ejercicios.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
		#region Gestor de Tareas
		[HttpGet("listar_tarea")]
		public List<listado_tarea> obtener_tarea()
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var query = from c in db.DetTareas
							orderby c.FechaCreacion descending
							select new listado_tarea
							{
								Id = c.Id,
								titulo=c.TituloTarea,
								descripcion=c.Descripcion,
								estado=c.Estado,
								fecha_creacion=c.FechaCreacion
							};
				var clientes = query.ToList();
				return clientes;
			}
		}
		[HttpGet("revisar_titulo_tarea")]
		public bool revisar_titulo_tarea([FromQuery] string titulo)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				bool existencia = db.DetTareas.Any(c => c.TituloTarea == titulo);
				return existencia;
			}
		}
		[HttpPost("alta_tarea")]
		public bool alta_tarea([FromBody] alta_tarea tarea)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var estatus = false;
				try
				{
					var nuevoRegistro = new DetTarea
					{
						TituloTarea = tarea.titulo,
						Descripcion = tarea.descripcion,
						Estado = tarea.estado,
						FechaCreacion = DateTime.Now,
						FechaModificacion = DateTime.Now
					};
					db.DetTareas.Add(nuevoRegistro);
					db.SaveChanges();
					estatus = true;
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
					estatus = false;
				}
				return estatus;
			}
		}
		[HttpDelete("eliminar_tarea")]
		public IActionResult EliminarTarea([FromQuery]int id_tarea)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var tarea = db.DetTareas.FirstOrDefault(t => t.Id == id_tarea);
				if (tarea == null)
				{
					return NotFound(new { message = "Tarea no encontrada" });
				}
				db.DetTareas.Remove(tarea);
				db.SaveChanges();
				return Ok(new { message = "Tarea eliminada con éxito" });
			}
		}
		[HttpPut("actualizar_tarea")]
		public IActionResult ActualizarTarea([FromQuery] int id_tarea, [FromBody] editar_tarea tarea)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				bool existencia = db.DetTareas.Any(c => c.TituloTarea == tarea.titulo && c.Id != id_tarea);
				if (existencia)
				{
					return NotFound(new { message = "La Tarea ya Existe con un título similar" });
				}
				var tarea_ = db.DetTareas.FirstOrDefault(t => t.Id == id_tarea);
				if (tarea_ == null)
				{
					return NotFound(new { message = "Tarea no encontrada" });
				}
				tarea_.TituloTarea = tarea.titulo;
				tarea_.Descripcion = tarea.descripcion;
				tarea_.Estado = tarea.estado;
				tarea_.FechaModificacion = DateTime.Now;
				db.SaveChanges();
				return Ok(new { message = "Tarea actualizada con éxito" });
			}
		}
		#endregion Gestor de Tareas
		#region Sistema de Reservas de Sala de Reuniones
		/*[HttpGet("listar_sala")]
		public List<listado_sala> obtener_sala()
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var query = from c in db.CatSalas
							orderby c.FechaCreacion descending
							select new listado_sala
							{
								Id = c.Id,
								nombre_sala = c.NombreSala,
								capacidad = c.Capacidad,
								estado = c.Estado,
								fecha_creacion = c.FechaCreacion
							};
				var clientes = query.ToList();
				return clientes;
			}
		}*/
		[HttpGet("listar_sala")]
		public List<listado_sala> obtener_sala()
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var query = from sala in db.CatSalas
							orderby sala.FechaCreacion descending
							select new listado_sala
							{
								Id = sala.Id,
								nombre_sala = sala.NombreSala,
								capacidad = sala.Capacidad,
								estado = sala.Estado,
								fecha_creacion = sala.FechaCreacion,
								reservaciones = (from reservacion in db.DetReunions
												 where reservacion.IdSala == sala.Id && reservacion.Activo == true
												 select new listar_reservacion
												 {
													 id = reservacion.Id,
													 fecha_inicio = reservacion.FechaInicioReunion,
													 fecha_fin = reservacion.FechaFinReunion
												 }).ToList()
							};

				var salas = query.ToList();
				return salas;
			}
		}

		[HttpPost("alta_sala")]
		public bool alta_sala([FromBody] editar_sala sala)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var estatus = false;
				try
				{
					var nuevoRegistro = new CatSala
					{
						NombreSala = sala.nombre_sala,
						Capacidad = sala.capacidad,
						Estado = sala.estado,
						FechaCreacion = DateTime.Now,
						FechaModificacion = DateTime.Now
					};
					db.CatSalas.Add(nuevoRegistro);
					db.SaveChanges();
					estatus = true;
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
					estatus = false;
				}
				return estatus;
			}
		}
		[HttpDelete("eliminar_sala")]
		public IActionResult EliminarSala([FromQuery] int id_sala)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var sala = db.CatSalas.FirstOrDefault(t => t.Id == id_sala);
				if (sala == null)
				{
					return NotFound(new { message = "Tarea no encontrada" });
				}
				db.CatSalas.Remove(sala);
				db.SaveChanges();
				return Ok(new { message = "Tarea eliminada con éxito" });
			}
		}
		[HttpPut("actualizar_sala")]
		public IActionResult ActualizarSala([FromQuery] int id_sala, [FromBody] editar_sala sala)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				bool existencia = db.CatSalas.Any(c => c.NombreSala == sala.nombre_sala && c.Id != id_sala);

				if (existencia)
				{
					return NotFound(new { message = "La Tarea ya Existe con un título similar" });
				}
				var sala_ = db.CatSalas.FirstOrDefault(t => t.Id == id_sala);
				if (sala_ == null)
				{
					return NotFound(new { message = "Sala no encontrada" });
				}
				sala_.NombreSala = sala.nombre_sala;
				sala_.Capacidad = sala.capacidad;
				sala_.Estado = sala.estado;
				sala_.FechaModificacion = DateTime.Now;
				db.SaveChanges();
				return Ok(new { message = "Sala actualizada con éxito" });
			}
		}
		[HttpPost("alta_reservacion")]
		public bool alta_reservacion([FromBody] alta_reservacion reservacion)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var estatus = false;
				try
				{
					var nuevoRegistro = new DetReunion
					{
						IdSala = reservacion.id_sala,
						FechaInicioReunion = reservacion.fecha_inicio,
						FechaFinReunion = reservacion.fecha_fin,
						Activo = true,
						FechaCreacion = DateTime.Now,
						FechaModificacion = DateTime.Now
					};
					db.DetReunions.Add(nuevoRegistro);
					db.SaveChanges();
					estatus = true;
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
					estatus = false;
				}
				return estatus;
			}
		}
		[HttpPost("validar_reunion")]
		public IActionResult AgendarReunion([FromBody] alta_reservacion reservacion)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				// Verificar si hay reuniones en la misma sala que se traslapan
				bool existeTraslape = db.DetReunions
					.Any(r => r.Activo == true && r.IdSala == reservacion.id_sala &&
							  ((reservacion.fecha_inicio >= r.FechaInicioReunion && reservacion.fecha_inicio < r.FechaFinReunion) ||
							   (reservacion.fecha_fin > r.FechaInicioReunion && reservacion.fecha_fin <= r.FechaFinReunion) ||
							   (reservacion.fecha_inicio < r.FechaInicioReunion && reservacion.fecha_fin > r.FechaFinReunion)));

				if (existeTraslape)
				{
					return Conflict(new { message = "La reunión se empalma con otra reunión existente." });
				}
				return Ok(new { message = "Reunión agendada correctamente" });
			}
		}
		[HttpDelete("eliminar_reservacion")]
		public IActionResult EliminarReservacion([FromQuery] int id_reservacion)
		{
			using (var db = new Models.DB.EjercicioContext())
			{
				var reservacion = db.DetReunions.FirstOrDefault(t => t.Id == id_reservacion);
				if (reservacion == null)
				{
					return NotFound(new { message = "Reservación no encontrada" });
				}
				reservacion.Activo = false;
				db.SaveChanges();
				return Ok(new { message = "Reservación eliminada con éxito" });
			}
		}
		#endregion Sistema de Reservas de Sala de Reuniones
	}
}