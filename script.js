let titulos = JSON.parse(localStorage.getItem('titulos')) || [];
let textos = JSON.parse(localStorage.getItem('textos')) || [];
// Inicializa las puntuaciones en localStorage si no existen
let puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || new Array(titulos.length).fill(0);

// Asigna los elementos del DOM a variables


// Ahora puedes usar estas variables en lugar de "document.getElementById"
anadir.addEventListener('click', function() {
    anadirContainer.style.display = 'block';
    estudiarContainer.style.display = 'none';
    editarContainer.style.display = 'none';
});

anadir.addEventListener('click', function() {
    document.getElementById('anadirContainer').style.display = 'block';
    document.getElementById('estudiarContainer').style.display = 'none';
    document.getElementById('editarContainer').style.display = 'none';
});

document.getElementById('estudiar').addEventListener('click', function() {
    document.getElementById('anadirContainer').style.display = 'none';
    document.getElementById('estudiarContainer').style.display = 'block';
    document.getElementById('editarContainer').style.display = 'none';
    estudiar();
});

document.getElementById('editar').addEventListener('click', function() {
    document.getElementById('anadirContainer').style.display = 'none';
    document.getElementById('estudiarContainer').style.display = 'none';
    document.getElementById('editarContainer').style.display = 'block';
    editar();
});

document.getElementById('exportar').addEventListener('click', function() {
    let data = {
        titulos: JSON.parse(localStorage.getItem('titulos')),
        textos: JSON.parse(localStorage.getItem('textos'))
    };
    let dataStr = JSON.stringify(data);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'data.json');
    linkElement.click();
    // Muestra el mensaje de confirmación con un retraso de 2 segundos
    setTimeout(function() {
        mostrarMensaje('Los datos se han guardado con éxito', '#008000');
    }, 2000);
});


document.getElementById('importar').addEventListener('click', function() {
    let inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.json';
    inputElement.onchange = function(event) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function(event) {
            try {
                let data = JSON.parse(event.target.result);
                localStorage.setItem('titulos', JSON.stringify(data.titulos));
                localStorage.setItem('textos', JSON.stringify(data.textos));
                // Actualiza las variables titulos y textos
                titulos = data.titulos;
                textos = data.textos;
                mostrarMensaje('Los datos se han importado con éxito', '#008000');
                // Refresca la tabla después de importar los datos
                editar();
            } catch (e) {
                mostrarMensaje('Hubo un error al importar los datos', '#ff0000');
            }
        };
        reader.readAsText(file);
    };
    inputElement.click();
});

function mostrarMensaje(mensaje, color) {
    let contenedorMensaje = document.getElementById('mensaje');
    contenedorMensaje.innerText = mensaje;
    contenedorMensaje.style.color = color;
    contenedorMensaje.style.display = 'block';
    setTimeout(function() {
        contenedorMensaje.style.display = 'none';
    }, 1500);
}


function limpiarTexto(texto) {
    // Convierte el texto a minúsculas
    texto = texto.toLowerCase();
    // Elimina los acentos
    texto = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    // Elimina los signos de puntuación
    texto = texto.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    // Elimina los espacios extra
    texto = texto.replace(/\s{2,}/g," ");
    return texto;
}

document.getElementById('aceptar').addEventListener('click', function() {
    let titulo = document.getElementById('titulo').value;
    let texto = document.getElementById('texto').value;

    // Guarda el texto completo tal cual lo ingresaste
    titulos.push(titulo);
    textos.push(texto);
    localStorage.setItem('titulos', JSON.stringify(titulos));
    localStorage.setItem('textos', JSON.stringify(textos));

    // Comprueba si el título tiene el formato de un pasaje bíblico
    let regex = /^(\D+)\s(\d+):(\d+)-(\d+)$/;
    let match = titulo.match(regex);
    if (match) {
        // Si el título tiene el formato de un pasaje bíblico, divide el texto en versículos
        let libro = match[1];
        let capitulo = match[2];
        let versiculoInicio = parseInt(match[3]);
        let versiculoFin = parseInt(match[4]);
        let versiculos = texto.split(/\d+\s/).slice(1); // Divide el texto en versículos

        // Comprueba si el número de versículos coincide con el rango de versículos
        if (versiculos.length === versiculoFin - versiculoInicio + 1) {
            // Si el número de versículos coincide, guarda cada versículo individualmente
            for (let i = 0; i < versiculos.length; i++) {
                let tituloVersiculo = libro + ' ' + capitulo + ':' + (versiculoInicio + i);
                let textoVersiculo = versiculos[i].trim();
                // Comprueba si el versículo ya existe en titulos antes de guardarlo
                if (!titulos.includes(tituloVersiculo)) {
                    titulos.push(tituloVersiculo);
                    textos.push(textoVersiculo);
                }
            }
            localStorage.setItem('titulos', JSON.stringify(titulos));
            localStorage.setItem('textos', JSON.stringify(textos));
            mostrarMensaje('Se ha añadido con éxito', '#008000');
        } else {
            mostrarMensaje('El número de versículos no coincide con el rango', '#ff0000');
        }
    } else {
        mostrarMensaje('Se ha añadido con éxito', '#008000');
    }

    document.getElementById('titulo').value = '';
    document.getElementById('texto').value = '';
});

function mostrarMensaje(mensaje, color) {
    let contenedorMensaje = document.getElementById('mensaje');
    contenedorMensaje.innerText = mensaje;
    contenedorMensaje.style.color = color;
    contenedorMensaje.style.display = 'block';
    setTimeout(function() {
        contenedorMensaje.style.display = 'none';
    }, 1500);
}

// Al inicio, deshabilita el botón "Revisar"
document.getElementById('revisar').disabled = true;
// Al inicio, deshabilita el botón "Continuar"
document.getElementById('continuar').disabled = true;

// Habilita el botón "Revisar" cuando el usuario ingresa texto
document.getElementById('textoEstudio').addEventListener('input', function() {
    document.getElementById('revisar').disabled = this.value.trim() === '';
});

document.getElementById('revisar').addEventListener('click', function() {
    let textoEstudio = document.getElementById('textoEstudio').value;
    // Limpia el texto del usuario antes de la comparación
    textoEstudio = limpiarTexto(textoEstudio);
    
    let index = JSON.parse(localStorage.getItem('index'));
    let texto = textos[index];

    var dmp = new diff_match_patch();
    var diff = dmp.diff_main(texto, textoEstudio);
    dmp.diff_cleanupSemantic(diff);

    var resultado = document.getElementById('comparacion');
    resultado.innerHTML = '';
    diff.forEach(function(part) {
        var color = part[0] == 0 ? 'grey' : (part[0] > 0 ? 'green' : 'red');
        var span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document.createTextNode(part[1]));
        resultado.appendChild(span);
    });

    // Agregar el texto original en letra pequeña
    var original = document.createElement('p');
    original.style.fontSize = 'small';
    original.innerText = 'El original dice: ' + texto;
    resultado.appendChild(original);

    let precision = 1 - (diff.filter(part => part[0] !== 0).length / diff.length);
    
    // Actualiza la puntuación del texto actual
    index = JSON.parse(localStorage.getItem('index'));
    puntuaciones[index] = (puntuaciones[index] * 4 + precision) / 5; // Promedio móvil
    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));

    // Habilita el botón "Continuar" después de que el usuario haya respondido
    document.getElementById('continuar').disabled = false;
});

document.getElementById('continuar').addEventListener('click', function() {
    document.getElementById('textoEstudio').value = '';
    document.getElementById('comparacion').innerText = '';
    estudiar();

    // Deshabilita nuevamente el botón "Continuar" hasta la próxima respuesta del usuario
    document.getElementById('continuar').disabled = true;
});

document.getElementById('guardarCambios').addEventListener('click', function() {
    let tabla = document.getElementById('editarTabla');
    let filas = tabla.getElementsByTagName('tr');
    titulos = [];
    textos = [];
    for (let i = 0; i < filas.length; i++) {
        let celdas = filas[i].getElementsByTagName('td');
        titulos.push(celdas[0].children[0].value);
        textos.push(celdas[1].children[0].value);
    }
    localStorage.setItem('titulos', JSON.stringify(titulos));
    localStorage.setItem('textos', JSON.stringify(textos));
});

function estudiar() {
    // Selecciona un texto para estudiar basado en las puntuaciones
    let sum = puntuaciones.reduce((a, b) => a + (1 - b), 0);
    let rand = Math.random() * sum;
    let index = puntuaciones.findIndex(puntuacion => (rand -= (1 - puntuacion)) < 0);
    localStorage.setItem('index', index);

    index = Math.floor(Math.random() * titulos.length);
    localStorage.setItem('index', index);
    document.getElementById('tituloEstudio').innerText = titulos[index];
}

function editar() {
    let tabla = document.getElementById('editarTabla');
    tabla.innerHTML = '';
    for (let i = 0; i < titulos.length; i++) {
        let fila = document.createElement('tr');
        let celdaTitulo = document.createElement('td');
        let celdaTexto = document.createElement('td');
        let celdaEliminar = document.createElement('td');
        let inputTitulo = document.createElement('input');
        let inputTexto = document.createElement('input');
        let botonEliminar = document.createElement('button');
        inputTitulo.type = 'text';
        inputTexto.type = 'text';
        botonEliminar.innerText = '✖';
        botonEliminar.addEventListener('click', function() {
            titulos.splice(i, 1);
            textos.splice(i, 1);
            localStorage.setItem('titulos', JSON.stringify(titulos));
            localStorage.setItem('textos', JSON.stringify(textos));
            editar();
        });
        inputTitulo.value = titulos[i];
        inputTexto.value = textos[i];
        celdaTitulo.appendChild(inputTitulo);
        celdaTexto.appendChild(inputTexto);
        celdaEliminar.appendChild(botonEliminar);
        fila.appendChild(celdaTitulo);
        fila.appendChild(celdaTexto);
        fila.appendChild(celdaEliminar);
        tabla.appendChild(fila);
    }
}

document.getElementById('textoEstudio').addEventListener('input', function() {
    this.style.height = 'auto'; /* Temporalmente cambia la altura a 'auto' para que el área de texto pueda encogerse si es necesario */
    this.style.height = this.scrollHeight + 'px'; /* Cambia la altura al tamaño del contenido */
});

document.getElementById('textoEstudio').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); /* Evita la acción predeterminada de Enter (añadir una nueva línea) */
        document.getElementById('revisar').click(); /* Activa el botón "Revisar" */
    }
});