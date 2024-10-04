let check_op_title = false, check_op_description = false;
function validar_btn_save_task() {
    if (check_op_title && check_op_description)
        $("#btn_save_new_task").prop("disabled", false);
    else
        $("#btn_save_new_task").prop("disabled", true);
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
    $(document).on('click', '.btn_edit_task', function () {
        let id = $(this).attr("id").split("-")[1];
        if ($(this).text() == "Editar") {
            $(this).text("Guardar");
            $('#tbody_list_task tr').each(function () {
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
            $(this).text("Editar");
            $.ajax({
                cache: false,
                type: "PUT",
                url: "/api/Auth/actualizar_tarea?id_tarea=" + id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: `{
                    "titulo":"`+ $("#tbl_titulo_tarea-" + id).val() + `",
                    "descripcion":"`+ $("#tbl_descripcion_tarea-" + id).val() + `",
                    "estado":`+ $('#tbl_estado-' + id).prop('checked') + `
                }`,
                cache: false,
                success: function (data) {
                    if (data) {
                        $('#tbody_list_task tr').each(function () {
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
                    }
                    else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Error al Guardar la Tarea",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                },
                error: function (response) {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error al Guardar la Tarea",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
    });
    $(document).on('click', '.btn_delete_task', function () {
        let id = $(this).attr("id").split("-")[1];
        $.ajax({
            cache: false,
            type: "DELETE",
            url: "/api/Auth/eliminar_tarea?id_tarea=" + id,
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
    $(document).on('click', '#btn_save_new_task', function () {
        $.ajax({
            cache: false,
            type: "POST",
            url: "/api/Auth/alta_tarea",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: `{
                "titulo":"`+$("#title_new_task").val()+`",
                "descripcion":"`+$("#description_new_task").val()+`",
                "estado":`+ ($("#status_new_task").val() == 0 ? false: true)+`
            }`,
            cache: false,
            success: function (data) {
                if (data) {
                    $('#div_add_task').hide();
                    $('#title_new_task').val();
                    $('#description_new_task').val();
                    $("#btn_save_new_task").prop("disabled", true);
                    location.reload();
                }
                else {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error al Guardar la Tarea",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            },
            error: function (response) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error al Guardar la Tarea",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
    $(document).on('change', '#description_new_task', function () {
        if ($(this).val().length > 0 && $(this).val().length < 501) {
            $('#description_new_task').attr('style', 'border: 2px solid green;');
            check_op_description = true;
        }
        else {
            $('#description_new_task').attr('style', 'border: 2px solid red;');
            check_op_description = false;
        }
        validar_btn_save_task();
    });
    $(document).on('change', '#title_new_task', function () {
        if ($(this).val().length > 2 && $(this).val().length < 101) {
            $('#title_new_task').attr('style', 'border: 2px solid green;');
            $.ajax({
                cache: false,
                type: "GET",
                url: "/api/Auth/revisar_titulo_tarea?titulo=" + $("#title_new_task").val(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                success: function (data) {
                    check_op_title = data;
                    if (!data) {
                        $('#title_new_task').attr('style', 'border: 2px solid green;');
                        check_op_title = true;
                    }
                    else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Error el Título ya Existe",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $('#title_new_task').attr('style', 'border: 2px solid red;');
                    }
                    validar_btn_save_task();
                },
                error: function (response) {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error el Título ya Existe",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
        else {
            check_op_title = false;
            $('#title_new_task').attr('style', 'border: 2px solid red;');
        }
    });
    $(document).on('click', '#btn_add_task', function () {
        if ($('#div_add_task').is(':hidden')) {
            $('#div_add_task').show();  // Mostrar si está oculto
        } else {
            $('#div_add_task').hide();  // Ocultar si está visible
        }
    });
    $.ajax({
        cache: false,
        type: "GET",
        url: "/api/Auth/listar_tarea",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            console.log(data);
            var contenedores = data.map(function (item) {
                let fechaFormat = item.fecha_creacion.substring(0, 16); // Extrae la fecha en formato 'YYYY-MM-DDTHH:MM'
                return `
                        <tr>
                            <td><label id="tbl_id-${item.id}">${item.id}</label></td>
                            <td><label id="tbl_titulo_tarea-${item.id}">${item.titulo}</label></td>
                            <td><label id="tbl_descripcion_tarea-${item.id}">${item.descripcion}</label></td>
                            <td>
                                <label class="form-check form-check-inline">
                                    <input class="form-check-input check-box-tbl-estatus" type="checkbox" id="tbl_estado-${item.id}" `+(item.estado ? "checked":"")+` disabled="disabled">
                                    <span class="form-check-label" id="tbl_estado_text-${item.id}">
                                    `+ (item.estado ? "Completado" : "Pendiente") +`
                                    </span>
                                </label>
                            </td>
                            <td><label id="tbl_fecha_creacion-${item.id}">${fechaFormat.replace("T"," ")}</label></td>
                            <td><button type="button" class="btn btn-warning btn_edit_task" id="task-${item.id}">Editar</button></td>
                            <td><button type="button" class="btn btn-danger btn_delete_task" id="task-${item.id}">Eliminar</button></td>
                        </tr>`;
            }).join('');
            $('#tbody_list_task').append(contenedores);
            $('#tbl_list_task').DataTable({
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
});