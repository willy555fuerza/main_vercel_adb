/* const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');



router.get('/downloadpdf', async (req, res) => {
  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);

    // Configuración de fuentes y colores
    doc.font('Helvetica');

    // Ruta del logo
    const logoPath = path.join(__dirname, '../../../public/img/WILL.png');
    
    // Verificar si el archivo del logo existe
    if (fs.existsSync(logoPath)) {
      // Agregar el logo al PDF
      doc.image(logoPath, 50, 50, { width: 100 });
    } else {
      console.error('Logo file not found:', logoPath);
    }

    doc.fontSize(20).text('THE BEST COMPANY ADB', { align: 'center' });

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
}); 

module.exports = router; */


const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const  pdf  = require('../models/imprimir'); // Ajusta la ruta según tu estructura de archivos


/*******EGRESOS__- */
router.post('/downloadpdff', async (req, res) => {
  const { id_egreso } = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.getAllventa(id_egreso);
    if (result.error) {
      return res.status(404).send(result.message);
    }
    const data = result.data[0];

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);

    // Configuración de fuentes y colores
    doc.font('Helvetica');

    // Ruta del logo
    const logoPath = path.join(__dirname, '../../../public/img/WILL.png');
    
    // Verificar si el archivo del logo existe
    if (fs.existsSync(logoPath)) {
      // Agregar el logo al PDF
      doc.image(logoPath, 50, 50, { width: 100 });
    } else {
      console.error('Logo file not found:', logoPath);
    }

    doc.fontSize(20).text('THE BEST COMPANY ADB', { align: 'center' });

    // Agregar datos del ingreso al PDF
    doc.moveDown(2);
    doc.fontSize(12).text('Detalles del Egreso:', { align: 'center', underline: true });

    // Añadir una tabla
    const tableTop = doc.y + 50; // Centrar verticalmente desde la posición actual
    const item = data;

    // Dibujar la tabla
    doc.fontSize(10);
    const rowHeight = 18; // Reducir aún más la altura de las filas
    let rowTop = tableTop;

    // Ancho de las columnas adaptado
    const columnWidths = [60, 110, 110, 110, 60]; // Ajustar los anchos de las columnas

    // Cabecera de la tabla con colores
    const headers = ['ID Egreso', 'Usuario', 'Tipo de Egreso', 'Monto', 'Fecha'];
    headers.forEach((header, i) => {
      doc.fillColor('blue')
        .rect(50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), rowTop, columnWidths[i], rowHeight)
        .fill();
      doc.fillColor('white')
        .text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
    });

    rowTop += rowHeight;

    // Datos de la tabla con colores alternados
    const values = [
      item.id_egreso,
      `${item.usuario_nombres || ''} ${item.usuario_apellidos || ''}`,
      item.tipo_egreso_nombre,
      item.monto,
      item.fecha_egreso
    ];

    values.forEach((value, i) => {
      doc.fillColor(i % 2 === 0 ? 'lightgray' : 'white')
        .rect(50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), rowTop, columnWidths[i], rowHeight)
        .fill();
      doc.fillColor('black')
        .text(value || '', 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
    });

    rowTop += rowHeight;

    // Asegurarse de que total_egresos esté definido
    const totalEgresos = item.total_egresos !== undefined && item.total_egresos !== null ? item.total_egresos : 'No disponible';

    doc.fillColor('red')
      .text(`Total de Egresos: ${totalEgresos}`, 50, rowTop);

    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

/*******INGRESOS__- */
router.post('/downloadpdf', async (req, res) => {
  const {id_ingreso} = req.body;

  try {
    // Obtener datos de la base de datos
    const result = await pdf.getAllventa(id_ingreso);
    if (result.error) {
      return res.status(404).send(result.message);
    }
    const data = result.data[0];

    
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdff');

    // Enviar el documento PDF al cliente
    doc.pipe(res);

    // Configuración de fuentes y colores
    doc.font('Helvetica');

    // Ruta del logo
    const logoPath = path.join(__dirname, '../../../public/img/WILL.png');
    
    // Verificar si el archivo del logo existe
    if (fs.existsSync(logoPath)) {
      // Agregar el logo al PDF
      doc.image(logoPath, 50, 50, { width: 100 });
    } else {
      console.error('Logo file not found:', logoPath);
    }

    doc.fontSize(20).text('THE BEST COMPANY ADB', { align: 'center' });

    // Agregar datos del ingreso al PDF
   /*  doc.moveDown(); */
   doc.moveDown(2);
   doc.fontSize(12).text('Detalles del Ingreso:', { align: 'center', underline: true });
   
   // Añadir una tabla
   const tableTop = doc.y + 50; // Centrar verticalmente desde la posición actual
   const item = data;
   
   // Dibujar la tabla
   doc.fontSize(10);
   const rowHeight = 18; // Reducir aún más la altura de las filas
   let rowTop = tableTop;
   
   // Ancho de las columnas adaptado
   const columnWidths = [60, 110, 110, 110, 60, 60]; // Ajustar los anchos de las columnas
   
   // Cabecera de la tabla con colores
   const headers = ['ID Ingreso', 'Usuario', 'Tipo de Ingreso', 'Miembro', 'Monto', 'Fecha'];
   headers.forEach((header, i) => {
     doc.fillColor('blue')
       .rect(50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), rowTop, columnWidths[i], rowHeight)
       .fill();
     doc.fillColor('white')
       .text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
   });
   
   rowTop += rowHeight;
   
   // Datos de la tabla con colores alternados
   const values = [
     item.id_ingreso,
     `${item.usuario_nombres || ''} ${item.usuario_apellidos || ''}`,
     item.tipo_ingreso_nombre,
     `${item.miembro_nombres || ''} ${item.miembro_apellidos || ''}`,
     item.monto,
     item.fecha_ingreso
   ];
   
   values.forEach((value, i) => {
     doc.fillColor(i % 2 === 0 ? 'lightgray' : 'white')
       .rect(50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), rowTop, columnWidths[i], rowHeight)
       .fill();
     doc.fillColor('black')
       .text(value || '', 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
   });
   
   rowTop += rowHeight;
   
   // Asegurarse de que total_ingresos esté definido
   const totalIngresos = item.total_ingresos !== undefined && item.total_ingresos !== null ? item.total_ingresos : 'No disponible';
   
   doc.fillColor('red')
     .text(`Total de Ingresos: ${totalIngresos}`, 50, rowTop);
   
    
    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

/*******INGRESOS__- */
router.post('/imprimirtablas', async (req, res) => {
  console.log(datosTablas)
  const { datosTablas } = req.body;

  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Enviar el documento PDF al cliente
    doc.pipe(res);

    // Configuración de fuentes y colores
    doc.font('Helvetica');

    // Ruta del logo
    const logoPath = path.join(__dirname, '../../../public/img/WILL.png');
    
    // Verificar si el archivo del logo existe
    if (fs.existsSync(logoPath)) {
      // Agregar el logo al PDF
      doc.image(logoPath, 50, 50, { width: 100 });
    } else {
      console.error('Logo file not found:', logoPath);
    }

    doc.fontSize(20).text('THE BEST COMPANY ADB', { align: 'center' });

    // Agregar datos del ingreso al PDF
    doc.moveDown(2);
    doc.fontSize(12).text('Detalles del Ingreso:', { align: 'center', underline: true });
   
    // Añadir una tabla
    const tableTop = doc.y + 20; // Centrar verticalmente desde la posición actual
   
    // Dibujar la tabla
    doc.fontSize(10);
    const rowHeight = 18; // Reducir aún más la altura de las filas
    let rowTop = tableTop;
   
    // Ancho de las columnas adaptado
    const columnWidths = [70, 110, 120, 80,110, 70]; // Ajustar los anchos de las columnas
   
    // Cabecera de la tabla con colores
    const headers = ['ID Ingreso', 'Usuario', 'Tipo de Ingreso','Miembro', 'Monto', 'Fecha'];
    headers.forEach((header, i) => {
      doc.fillColor('blue')
        .rect(50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), rowTop, columnWidths[i], rowHeight)
        .fill();
      doc.fillColor('white')
        .text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
    });
   
    
  
    rowTop += rowHeight;

    // Datos de la tabla con colores alternados
    const values = [
      item.id_ingreso,
      `${item.usuario_nombres || ''} ${item.usuario_apellidos || ''}`,
      item.tipo_ingreso_nombre,
      `${item.miembro_nombres || ''} ${item.miembro_apellidos || ''}`,
      item.monto,
      item.fecha_ingreso
    ];

    values.forEach((value, i) => {
      doc.fillColor(i % 2 === 0 ? 'lightgray' : 'white')
        .rect(50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), rowTop, columnWidths[i], rowHeight)
        .fill();
      doc.fillColor('black')
        .text(value || '', 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
    });

    rowTop += rowHeight;
    
    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});


/*******EGRESOS__- */
router.post('/imprimirtabla', async (req, res) => {
  const { datosTabla } = req.body;

  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 50 });
    let filename = 'Recibo.pdf';
    filename = encodeURIComponent(filename);

    // Configurar los encabezados de la respuesta
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdff');

    // Enviar el documento PDF al cliente
    doc.pipe(res);

    // Configuración de fuentes y colores
    doc.font('Helvetica');

    // Ruta del logo
    const logoPath = path.join(__dirname, '../../../public/img/WILL.png');
    
    // Verificar si el archivo del logo existe
    if (fs.existsSync(logoPath)) {
      // Agregar el logo al PDF
      doc.image(logoPath, 50, 50, { width: 100 });
    } else {
      console.error('Logo file not found:', logoPath);
    }

    doc.fontSize(20).text('THE BEST COMPANY ADB', { align: 'center' });

    // Agregar datos del ingreso al PDF
    doc.moveDown(2);
    doc.fontSize(12).text('Detalles del Egreso:', { align: 'center', underline: true });
   
    // Añadir una tabla
    const tableTop = doc.y + 20; // Centrar verticalmente desde la posición actual
   
    // Dibujar la tabla
    doc.fontSize(10);
    const rowHeight = 18; // Reducir aún más la altura de las filas
    let rowTop = tableTop;
   
    // Ancho de las columnas adaptado
    const columnWidths = [60, 110, 120, 110, 110]; // Ajustar los anchos de las columnas
   
    // Cabecera de la tabla con colores
    const headers = ['ID Egreso', 'Usuario', 'Tipo de Egreso', 'Monto', 'Fecha'];
    headers.forEach((header, i) => {
      doc.fillColor('blue')
        .rect(50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), rowTop, columnWidths[i], rowHeight)
        .fill();
      doc.fillColor('white')
        .text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
    });
   
    rowTop += rowHeight;
  
    datosTabla.forEach((row) => {
      // Reordenar los datos para que el segundo dato (Usuario) se mueva al final
      const reorderedRow = [row[0], row[2], row[3],row[4], row[1]];
      
      // Dibujar cada celda en la fila
      reorderedRow.forEach((cell, i) => {
        doc.fillColor('black')
          .text(cell, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, rowTop + 3, { width: columnWidths[i] - 10, align: 'center' });
      });
      // Mover la posición y hacia abajo para la siguiente fila
      rowTop += rowHeight;
    });
    
    // Finalizar el documento PDF
    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar el PDF');
  }
});
module.exports = router;


