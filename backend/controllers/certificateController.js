const Certificate = require('../models/Certificate');
const QRCode = require('qrcode');
const { format } = require('date-fns');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

exports.generateCertificate = async (req, res) => {
  try {
    const {
      studentName,
      idNumber,
      internshipTopic,
      guideName,
      startDate,
      endDate,
      issuerName,
      issuerDesignation
    } = req.body;

    // Generate verification URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const certificateId = new mongoose.Types.ObjectId();
    const verificationUrl = `${baseUrl}/verify/${certificateId}`;

    // Generate QR code data URL
    const qrCodeData = await QRCode.toDataURL(verificationUrl);

    // Create certificate
    const certificate = new Certificate({
      _id: certificateId,
      studentName,
      idNumber,
      internshipTopic,
      guideName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      issuerName,
      issuerDesignation,
      qrCodeData,
      verificationUrl
    });

    await certificate.save();

    res.status(201).json({
      success: true,
      certificate: {
        ...certificate.toObject(),
        formattedStartDate: format(new Date(startDate), 'MMMM d, yyyy'),
        formattedEndDate: format(new Date(endDate), 'MMMM d, yyyy'),
        formattedIssuedDate: format(new Date(), 'MMMM d, yyyy'),
        id: certificateId
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.status(200).json({
      success: true,
      certificate: {
        ...certificate.toObject(),
        formattedStartDate: format(certificate.startDate, 'MMMM d, yyyy'),
        formattedEndDate: format(certificate.endDate, 'MMMM d, yyyy'),
        formattedIssuedDate: format(certificate.createdAt, 'MMMM d, yyyy')
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Create PDF document
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificate.idNumber}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add certificate content
    doc.fontSize(24).text('CERTIFICATE', { align: 'center', underline: true }).moveDown(2);
    
    doc.fontSize(14).text(`This is to certify that ${certificate.studentName} (${certificate.idNumber})`, {
      align: 'center'
    }).moveDown(1);
    
    doc.text('of 6th semester undergraduate student in the Department of Computer Science and Technology,', {
      align: 'center'
    }).moveDown(1);
    
    doc.text('Indian Institute of Engineering Science and Technology, Shibpur, Howrah, West Bengal, India', {
      align: 'center'
    }).moveDown(1);
    
    doc.text(`has successfully completed Summer Internship Program on "${certificate.internshipTopic}",`, {
      align: 'center'
    }).moveDown(1);
    
    doc.text(`under the guidance of ${certificate.guideName} in the Department of Computer Science and Technology,`, {
      align: 'center'
    }).moveDown(1);
    
    doc.text(`IIEST Shibpur during the period from ${format(certificate.startDate, 'MMMM d, yyyy')} to ${format(certificate.endDate, 'MMMM d, yyyy')}`, {
      align: 'center'
    }).moveDown(2);
    
    doc.text(`Dated: ${format(certificate.createdAt, 'MMMM d, yyyy')}`, {
      align: 'right'
    }).moveDown(1);
    
    doc.text(certificate.issuerName, {
      align: 'right'
    }).moveDown(0.5);
    
    doc.text(certificate.issuerDesignation, {
      align: 'right'
    }).moveDown(0.5);
    
    doc.text('Department of Computer Science and Technology', {
      align: 'right'
    }).moveDown(0.5);
    
    doc.text('IIEST Shibpur, Howrah -- 711103.', {
      align: 'right'
    }).moveDown(2);
    
    // Add QR code
    const qrCodeBuffer = Buffer.from(certificate.qrCodeData.split(',')[1], 'base64');
    doc.image(qrCodeBuffer, doc.page.width - 150, 50, { width: 100 });
    doc.fontSize(10).text('Scan to verify', doc.page.width - 150, 160, { width: 100, align: 'center' });
    
    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};