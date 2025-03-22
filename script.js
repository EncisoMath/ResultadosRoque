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
        const header = rows.shift().split(',').map(col => col.trim());

        // Crear un mapa de nombres de columna a índices
        const columnMap = header.reduce((map, column, index) => {
            map[column] = index;
            return map;
        }, {});

        let encontrado = false;

        for (const row of rows) {
            const columns = row.split(',').map(col => col.trim());
            if (columns.length) {
                const ID = columns[columnMap['ID']];
                const NOMBRE = columns[columnMap['NOMBRE']];

                if (ID === codigo) {
                    // Crear los enlaces de descarga para las imágenes
                    const idAlumno = codigo;
                    const imgP1 = `Soportes/${prueba}/${idAlumno}_p1.jpg`;
                    const imgP2 = `Soportes/${prueba}/${idAlumno}_p2.jpg`;

                    resultado.innerHTML = `
                        <h1>Resultados</h1>
                        <div class="resultado-left" style="width: 100%; text-align: center; margin-bottom: 20px;">
                            <div class="resultado-item" style="margin-bottom: 10px;">
                                <span class="bold-font" style="color: orange; font-size: 22px;">Alumno: </span>
                                <span>${NOMBRE}</span>
                            </div>
                        </div>
                        <hr>
                        <h3>Aquí está tu examen:</h3>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                            <button onclick="window.location.href='${imgP1}'" style="padding: 10px; font-size: 18px;">Descarga tu prueba P1</button>
                            <button onclick="window.location.href='${imgP2}'" style="padding: 10px; font-size: 18px;">Descarga tu prueba P2</button>
                        </div>
                    `;
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
