async function cargarAnios() {
    try {
        const response = await fetch('Datos/Pruebas.csv');
        if (!response.ok) {
            throw new Error(`Error al cargar el CSV: ${response.statusText}`);
        }
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Saltar la cabecera

        // Extraer años únicos
        const anios = new Set();
        rows.forEach(row => {
            const columns = row.split(',');
            if (columns.length) {
                const ANIO = columns[0].trim(); // Extraer y limpiar el valor de ANIO
                if (ANIO) { // Asegurarse de que ANIO no esté vacío
                    anios.add(ANIO);
                }
            }
        });

        const anoSelect = document.getElementById('ano');
        anios.forEach(anio => {
            const option = document.createElement('option');
            option.value = anio;
            option.textContent = anio;
            anoSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar los años:', error);
    }
}

// Función para cargar las pruebas según el año seleccionado
async function cargarPruebas() {
    const anio = document.getElementById('ano').value;
    if (!anio) return;

    try {
        const response = await fetch('Datos/Pruebas.csv');
        if (!response.ok) {
            throw new Error(`Error al cargar el CSV: ${response.statusText}`);
        }
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Saltar la cabecera

        // Extraer pruebas para el año seleccionado
        const pruebas = new Set();
        rows.forEach(row => {
            const columns = row.split(',');
            if (columns.length) {
                const [ANIO, NOMBREPRUEBA] = columns.map(col => col.trim()); // Extraer valores de ANIO y PRUEBA
                if (ANIO === anio) {
                    pruebas.add(NOMBREPRUEBA);
                }
            }
        });

        const pruebaSelect = document.getElementById('prueba');
        pruebaSelect.innerHTML = '<option value="">Selecciona una prueba</option>'; // Limpiar opciones anteriores
        pruebas.forEach(prueba => {
            const option = document.createElement('option');
            option.value = prueba;
            option.textContent = prueba;
            pruebaSelect.appendChild(option);
        });

        document.getElementById('container-prueba').style.display = 'block'; // Mostrar el campo de prueba

    } catch (error) {
        console.error('Error al cargar las pruebas:', error);
    }
    cargarCSV();
}

// Función para mostrar el campo de código cuando se selecciona una prueba
function mostrarCampoCodigo() {
    const prueba = document.getElementById('prueba').value;
    if (prueba) {
        document.getElementById('busqueda').style.display = 'block'; // Mostrar el campo de código
    }
}




let kakashi = ''; // Constante para almacenar el resultado
let naruto = []; // Constante para almacenar el resultado
let asignaturas = []; // Lista para almacenar los datos separados

async function cargarCSV() {
    let sasuke = ''; // Constante para almacenar el resultado
    let sakura = ''; // Constante para almacenar el resultado
    const pruebaBuscada = document.getElementById('prueba').value;
    try {
        // Carga el archivo CSV
        const response = await fetch('Datos/Pruebas.csv');
        const csvText = await response.text();

        // Divide las filas del CSV y extrae los encabezados
        const filas = csvText.split('\n').filter(row => row.trim() !== ''); // Elimina filas vacías
        const encabezados = filas[0].split(',').map(header => header.trim());
        
        // Encuentra los índices de las columnas relevantes
        const indiceNombrePrueba = encabezados.indexOf('NOMBREPRUEBA');
        const indiceAsignaturas = encabezados.indexOf('ASIGNATURAS');
        const indiceArchivo = encabezados.indexOf('ARCHIVO'); // Índice para la columna ARCHIVO
        const indicePreguntas = encabezados.indexOf('PREGUNTAS'); // Índice para la columna ARCHIVO

        // Recorre las filas para encontrar la coincidencia con 'pruebaBuscada'
        for (let i = 1; i < filas.length; i++) {
            const fila = filas[i].split(',').map(field => field.trim());
            if (fila[indiceNombrePrueba] === pruebaBuscada) {
                sasuke = fila[indiceAsignaturas]; // Actualiza la variable global 'sasuke'
                sakura = fila[indicePreguntas]; // Actualiza la variable global 'sasuke'
                asignaturas = sasuke.split(';').map(item => item.trim()); // Divide el valor de 'sasuke' en una lista usando el separador ';'
                naruto = sakura.split(';').map(item => item.trim()); // Divide el valor de 'sasuke' en una lista usando el separador ';'
                
                kakashi = fila[indiceArchivo]; // Actualiza la variable global 'kakashi'
                break; // Termina el bucle cuando se encuentra el resultado
            }
        }

        // Verifica el contenido de 'sasuke', 'asignaturas' y 'kakashi' en la consola
        console.log('sasuke:', sasuke);
        console.log('asignaturas:', asignaturas);
        console.log('kakashi:', kakashi);
        console.log('naruto:', naruto);
        
    } catch (error) {
        console.error("Error al leer el archivo CSV:", error);
    }
}



async function cargarNombresAsignaturas() {
    try {
        const response = await fetch('Datos/NombreAsignatura.csv');
        if (!response.ok) {
            throw new Error(`Error al cargar Datos/NombreAsignatura.csv: ${response.statusText}`);
        }
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Saltar la cabecera

        // Crear un mapa de ASIGNATURA a NOMBREASIGNATURA
        const nombreAsignaturaMap = new Map();
        rows.forEach(row => {
            const [ASIGNATURA, NOMBREASIGNATURA] = row.split(',').map(col => col.trim());
            if (ASIGNATURA && NOMBREASIGNATURA) {
                nombreAsignaturaMap.set(ASIGNATURA, NOMBREASIGNATURA);
            }
        });

        return nombreAsignaturaMap;

    } catch (error) {
        console.error('Error al cargar los nombres de asignaturas:', error);
        return new Map();
    }
}


// Función para buscar y mostrar los resultados del alumno
async function buscar() {
    cargarCSV();
    const codigo = document.getElementById('codigo').value.trim();
    const resultado = document.getElementById('resultado');
    const anio = document.getElementById('ano').value;
    const prueba = document.getElementById('prueba').value;

    if (codigo.length !== 4) {
        resultado.innerHTML = 'Por favor, ingresa un código de 4 dígitos.';
        return;
    }

    try {
        const nombreAsignaturaMap = await cargarNombresAsignaturas();
        const response = await fetch(`Datos/${kakashi}.csv`);
        if (!response.ok) {
            throw new Error(`Error al cargar el CSV: ${response.statusText}`);
        }
        const data = await response.text();
        const rows = data.split('\n');

        // Obtener los nombres de las columnas
        const header = rows.shift().split(',').map(col => col.trim()); // Obtener la primera fila como encabezado

        // Crear un mapa de nombres de columna a índices
        const columnMap = header.reduce((map, column, index) => {
            map[column] = index;
            return map;
        }, {});

        let encontrado = false;
        const datosAsignaturas = [];

        for (const row of rows) {
            const columns = row.split(',').map(col => col.trim());
            if (columns.length) {
                const ANIO = columns[columnMap['ANIO']];
                const PRUEBA = columns[columnMap['PRUEBA']];
                const ID = columns[columnMap['ID']];
                const NOMBRE = columns[columnMap['NOMBRE']];
                const SEDE = columns[columnMap['SEDE']];
                const GRADO = columns[columnMap['GRADO']];
                const RANKING_C = columns[columnMap['RANKING_C']];
                const RANKING_G = columns[columnMap['RANKING_G']];

                if (ID === codigo) {
                    asignaturas.forEach(asignatura => {
                        const nombreAsignatura = nombreAsignaturaMap.get(asignatura) || asignatura;
                        datosAsignaturas.push({
                            nombre: nombreAsignatura,
                            icono: asignatura,
                            respuestasCorrectas: columns[columnMap[asignatura]],
                            cantidadPreguntas: columns[columnMap[`Q_${asignatura}`]],
                            resultado: columns[columnMap[`R_${asignatura}`]]
                        });
                    });

                    // Construir la tabla con las notas
const tablaNotas = `
    <table border="1" style="border-collapse: collapse; width: 100%; font-size: 25px;"> <!-- Establece tamaño de letra general -->
        <thead>
            <tr>
                <th style="padding: 8px; text-align: center; font-size: 25px">Asignatura</th>
                <th style="padding: 8px; text-align: center; font-size: 25px">Aciertos</th>
                <th style="padding: 8px; text-align: center; font-size: 25px">Nota</th>
            </tr>
        </thead>
        <tbody>
            ${datosAsignaturas.map((asignatura, index) => {
                // Seleccionar el valor de naruto según el índice de la asignatura
                const preguntas = naruto[index] || 'N/A'; // Usa 'N/A' si no hay suficientes valores en naruto
                
                return `
                    <tr>
                        <td style="padding: 8px; text-align: center; font-size: 18px">
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                ${(() => {
                                    const Icon = `Iconos/${asignatura.icono}.png`;
                                    return `<img 
                                        src="${Icon}"
                                        style="width: 50px; height: 50px;"
                                        onerror="this.src='https://via.placeholder.com/60';"
                                        alt="${asignatura.nombre}">`;
                                })()}
                                <span>${asignatura.nombre}</span>
                            </div>
                        </td>
                        <td class="numero-font" style="padding: 8px;">
                            <span>${asignatura.respuestasCorrectas}</span>
                            <span style="font-size: 15px;"> / </span> 
                            <span style="font-size: 15px;">${preguntas}</span>
                        </td>
                        <td class="numero-font" style="padding: 8px;">${asignatura.resultado}</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    </table>
`;



const idAlumno = codigo; // El ID del alumno es el código ingresado
const imgExtensions = ['jpg','pdf']; // Extensiones de imagen permitidas
let imgExamen1 = '';
let imgExamen2 = '';
let imgExamen3 = '';
let imgExamen4 = '';

for (let i = 1; i <= 4; i++) {
    for (const ext of imgExtensions) {
        const imgExamen = `Soportes/${prueba}/${idAlumno}_p${i}.${ext}`;
        try {
            const response = await fetch(imgExamen);
            if (response.ok) {
                eval(`imgExamen${i} = imgExamen`); // Asignar la imagen encontrada a la variable correspondiente
                break; // Si encuentra la imagen, se sale del bucle
            }
        } catch (error) {
            console.error(`Imagen no encontrada: ${imgExamen}`);
        }
    }
}





                    
// Función para comprobar si la imagen existe
function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}

async function renderResultados() {
    const images = [imgExamen1, imgExamen2, imgExamen3, imgExamen4];
    const validImages = [];

    // Comprobar cada imagen y agregar las válidas al array
    for (const img of images) {
        if (await checkImageExists(img)) {
            validImages.push(img);
        }
    }

    resultado.innerHTML = `

<h3>Aquí está tu examen:</h3>

<div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
    <!-- Contenedor de los botones de descarga -->




    <!-- Descripción de colores -->
    <div style="text-align: center; width: 100%; max-width: 1000px;">
        <p>🟢 Correcta | 🟡 Respuesta Correcta | 🔴 Incorrecta</p>
    </div>
</div>

    `;
}

// Llama a la función para renderizar los resultados
renderResultados();
                    encontrado = true;
                    break;
                }
            }
        }

        if (!encontrado) {
            resultado.innerHTML = 'No se encontraron resultados para el código ingresado.';
        }

    } catch (error) {
        console.error('Error al buscar resultados:', error);
    }
}

// Cargar los años al cargar la página
document.addEventListener('DOMContentLoaded', cargarAnios);
