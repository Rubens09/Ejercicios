let check_op_name = false, check_op_number = false;
function validar_btn_save_room() {
    if (check_op_name && check_op_number)
        $("#btn_save_new_room").prop("disabled", false);
    else
        $("#btn_save_new_room").prop("disabled", true);
}
$(document).ready(function () {
    $(document).on('change', '.check-box-tbl-estatus', function () {
        let id = $(this).attr("id").split("-")[1];
        if ($("#tbl_estado_text-" + id).text().includes("Pendiente")) {
            $("#tbl_estado_text-" + id).text("Completado");
        }
        else {
            $("#tbl_estado_text-" + id).text("Pendiente");
        }
    });
    $(document).on('click', '.btn_edit_room', function () {
        let id = $(this).attr("id").split("-")[1];
        if ($(this).text() == "Editar") {
            $(this).text("Guardar");
            $('#tbody_list_room tr').each(function () {
                $(this).find('td').each(function () {
                    $(this).find('label').each(function () {
                        const labelId = $(this).attr('id');
                        if (labelId.includes(id) && !labelId.includes("tbl_id") && !labelId.includes("tbl_fecha_creacion")) {
                            const labelText = $(this).text();
                            const input = $('<input>', {
                                type: 'text',
                                id: labelId,
                                value: labelText,
                                class: 'form-control'
                            });
                            $("#"+labelId).replaceWith(input);
                        }
                        $("#tbl_estado-" + id).prop("disabled", false);
                    });
                });
            });
            $(this).text('Guardar').removeClass('btn-warning').addClass('btn-success');
        }
        else {
            $.ajax({
                cache: false,
                type: "PUT",
                url: "/api/Auth/actualizar_sala?id_sala=" + id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: `{
                    "nombre_sala":"`+ $("#tbl_nombre_sala-" + id).val() + `",
                    "capacidad":`+ $("#tbl_capacidad_sala-" + id).val() + `,
                    "estado":`+ $('#tbl_estado-' + id).prop('checked') + `
                }`,
                cache: false,
                success: function (data) {
                    if (data) {
                        $('#tbody_list_room tr').each(function () {
                            $(this).find('td').each(function () {
                                $(this).find('input').each(function () {
                                    const inputId = $(this).attr('id');
                                    if (inputId.includes(id) && !inputId.includes("tbl_id") && !inputId.includes("tbl_fecha_creacion") && !inputId.includes("tbl_estado")) {
                                        const inputValue = $(this).val();
                                        const label = $('<label>', {
                                            id: inputId,
                                            text: inputValue
                                        });
                                        $("#tbl_estado-" + id).prop("disabled", true);
                                        $("#" + inputId).replaceWith(label);
                                    }
                                });
                            });
                        });
                        $("#room-" + id).text("Editar");
                    }
                    else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Error al Guardar la Sala",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                },
                error: function (response) {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error al Guardar la Sala",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
    });
    $(document).on('click', '.btn_delete_room', function () {
        let id = $(this).attr("id").split("-")[1];
        $.ajax({
            cache: false,
            type: "DELETE",
            url: "/api/Auth/eliminar_sala?id_sala=" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                location.reload();
            },
            error: function (response) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error al Eliminar la Tarea",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
    $(document).on('click', '.btn_delete_reserv', function () {
        let id = $(this).attr("id").split("-")[1];
        $.ajax({
            cache: false,
            type: "DELETE",
            url: "/api/Auth/eliminar_reservacion?id_reservacion=" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                location.reload();
            },
            error: function (response) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error al Eliminar la Reservación",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
    $(document).on('click', '#btn_save_new_room', function () {
        $.ajax({
            cache: false,
            type: "POST",
            url: "/api/Auth/alta_sala",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: `{
                "nombre_sala":"`+$("#name_new_room").val()+`",
                "capacidad":"`+$("#number_new_room").val()+`",
                "estado":`+ ($("#status_new_room").val() == 0 ? false: true)+`
            }`,
            cache: false,
            success: function (data) {
                if (data) {
                    $('#div_add_room').hide();
                    $('#name_new_room').val();
                    $('#number_new_room').val();
                    $("#btn_save_new_room").prop("disabled", true);
                    location.reload();
                }
                else {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error al Guardar la Sala",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            },
            error: function (response) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error al Guardar la Sala",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
    $(document).on('change', '#number_new_room', function () {
        if ($(this).val() > 0) {
            $('#number_new_task').attr('style', 'border: 2px solid green;');
            check_op_number = true;
        }
        else {
            $('#number_new_task').attr('style', 'border: 2px solid red;');
            check_op_number = false;
        }
        validar_btn_save_room();
    });
    $(document).on('change', '#name_new_room', function () {
        if ($(this).val().length > 0) {
            $('#name_new_task').attr('style', 'border: 2px solid green;');
            check_op_name = true;
        }
        else {
            check_op_name = false;
            $('#name_new_task').attr('style', 'border: 2px solid red;');
        }
        validar_btn_save_room();
    });
    $(document).on('click', '#btn_add_room', function () {
        if ($('#div_add_room').is(':hidden')) {
            $('#div_add_room').show();
        } else {
            $('#div_add_room').hide();
        }
    });
    $(document).on('click', '.btn_view_room_reserv', function () {
        let id = $(this).attr("id").split("-")[1];
        $("#list_name_reserv_room").append(`<select class="form-select" id="name_reserv_room" disabled="disabled"><option value="${id}">` + (($("#tbl_nombre_sala-" + id).text() == undefined || $("#tbl_nombre_sala-" + id).text() == "") ? $("#tbl_nombre_sala-" + id).val() : $("#tbl_nombre_sala-" + id).text()) + `</option></select>`);
        if ($('#div_add_reserv').is(':hidden')) {
            $('#div_add_reserv').show();
        } else {
            $('#div_add_reserv').hide();
        }
    });
    let list_salas = "";
    $.ajax({
        cache: false,
        type: "GET",
        url: "/api/Auth/listar_sala",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            console.log(data);
            let reservaciones = "";
            var contenedores = data.map(function (item) {
                let fechaFormat = item.fecha_creacion.substring(0, 16);
                for (let x = 0; x < item.reservaciones.length; x++) {
                    reservaciones = reservaciones + `<tr>
                        <td>${item.reservaciones[x].id}</td>
                        <td>${item.reservaciones[x].fecha_inicio}</td>
                        <td>${item.reservaciones[x].fecha_fin}</td>
                        <td><button type="button" class="btn btn-danger btn_delete_reserv" id="reserv_delete-${item.reservaciones[x].id}">Eliminar</button></td>
                    </tr>`;
                }
                return `
                        <tr id="tbl_tr-${item.id}">
                            <td><label id="tbl_id-${item.id}">${item.id}</label></td>
                            <td><label id="tbl_nombre_sala-${item.id}">${item.nombre_sala}</label></td>
                            <td><label id="tbl_capacidad_sala-${item.id}">${item.capacidad}</label></td>
                            <td>
                                <label class="form-check form-check-inline">
                                    <input class="form-check-input check-box-tbl-estatus" type="checkbox" id="tbl_estado-${item.id}" `+(item.estado ? "checked":"")+` disabled="disabled">
                                    <span class="form-check-label" id="tbl_estado_text-${item.id}">
                                    `+ (item.estado ? "Disponible" : "Ocupado") +`
                                    </span>
                                </label>
                            </td>
                            <td><label id="tbl_fecha_creacion-${item.id}">${fechaFormat.replace("T"," ")}</label></td>
                            <td><button type="button" class="btn btn-warning btn_edit_room" id="room-${item.id}">Editar</button></td>
                            <td><button type="button" class="btn btn-danger btn_delete_room" id="delete-${item.id}">Eliminar</button></td>
                            <td><button type="button" class="btn btn-secondary btn_view_room_reserv" id="view-${item.id}">Reservar</button></td>
                            <td><table class="table table-hover my-0" id="tbl_reserv-${item.id}"><thead><tr><th>Id</th><th>Fecha Inicio</th><th>Fecha Fin</th><th></th></tr></thead><tbody>` + reservaciones +`</tbody></table></td>
                        </tr>`;
                $('#tbl_reserv-' + item.id).DataTable({
                    scrollX: true,
                    language: {
                        url: "/vendor/es-MX.json",
                    },
                });
                list_salas = list_salas + `<option value="${item.id}">${item.nombre_sala}</option>`;
            }).join('');
            //$("#list_name_reserv_room").append(`<select class="form-select" id="name_reserv_room">` + list_salas + `</select>`);
            $('#tbody_list_room').append(contenedores);
            $('#tbl_list_room').DataTable({
                scrollX: true,
                language: {
                    url: "/vendor/es-MX.json",
                },
            });
        },
        error: function (response) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error al Obtener Tareas",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
    $('#fecha_inicio_reserv_room').attr("min", new Date().toISOString().slice(0, 16));
    //$('#fecha_inicio_reserv_room').val(new Date().toISOString().slice(0, 16));
    $('#fecha_fin_reserv_room').attr("min", new Date().toISOString().slice(0, 16));
    $('#fecha_inicio_reserv_room').on('change', function () {
        $("#fecha_fin_reserv_room").prop("disabled", false);
        let fechaInicio = $(this).val();
        $('#fecha_fin_reserv_room').attr("min", fechaInicio);
    });
    $('#fecha_fin_reserv_room').on('change', function () {
        if ($(this).val() > $('#fecha_inicio_reserv_room').val()) {
            $.ajax({
                cache: false,
                type: "POST",
                url: "/api/Auth/validar_reunion",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: `{
                    "id_sala":"`+ $("#name_reserv_room").val() + `",
                    "fecha_inicio":"`+ $("#fecha_inicio_reserv_room").val() + `",
                    "fecha_fin":"`+ $("#fecha_fin_reserv_room").val() + `"
                }`,
                cache: false,
                success: function (data) {
                    if (data.message == "Reunión agendada correctamente") {
                        $("#btn_save_new_reserv").prop("disabled", false);
                    }
                    else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Error al Guardar la Reservación",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                },
                error: function (response) {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error al Guardar la Reservación",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
        else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error la fecha final debe ser porsterior a la inicial",
                showConfirmButton: false,
                timer: 1500
            });
            $("#btn_save_new_room").prop("disabled", true);
        }
    });
    $(document).on('click', '#btn_save_new_reserv', function () {
        $.ajax({
            cache: false,
            type: "POST",
            url: "/api/Auth/alta_reservacion",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: `{
                "id_sala":"`+ $("#name_reserv_room").val() + `",
                "fecha_inicio":"`+ $("#fecha_inicio_reserv_room").val() + `",
                "fecha_fin":"`+ $("#fecha_fin_reserv_room").val() + `"
            }`,
            cache: false,
            success: function (data) {
                if (data) {
                    location.reload();
                }
                else {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error al Guardar la Reservación",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            },
            error: function (response) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error al Guardar la Reservación",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
});