import jsPDF from 'jspdf';

export async function generarFactura(datosFactura) {

    const factura = extraerDatos(datosFactura);
    const doc = new jsPDF();

    // Estilo general
    doc.setFont("helvetica");

    // Título centrado
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURA", 105, 20, { align: "center" });

    // Empresa
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Lavadero WahTrack", 20, 30);
    doc.text("USUARIO: nanana", 20, 36);
    doc.text("CORREO: correoElectronico", 20, 42);

    // Línea divisoria
    doc.setDrawColor(180);
    doc.line(20, 48, 190, 48);

    // Datos del cliente
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Cliente", 20, 56);
    doc.setFont("helvetica", "normal");
    doc.text("Cliente: Juan Pérez", 20, 62);
    doc.text("Cédula: 123456789", 20, 68);
    doc.text("Placa: ABC123", 20, 74);

    // Línea divisoria
    doc.line(20, 80, 190, 80);

    // Detalles del servicio
    doc.setFont("helvetica", "bold");
    doc.text("Detalle del Servicio", 20, 88);
    doc.setFont("helvetica", "normal");
    doc.text("Servicio: Lavado completo", 20, 94);
    doc.text("Precio: $25.000", 20, 100);

    // Línea divisoria
    doc.line(20, 106, 190, 106);

    // Total destacado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL: $25.000", 20, 116);

    // Pie de página
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Factura generado por WashTrack Industries \nGracias por su preferencia", 105, 280, { align: "center" });

    // Guardar el PDF
    doc.save("factura.pdf");
}

async function extraerDatos(factura) {
    let atributosFactura = {};

    console.log(factura);

    
}
