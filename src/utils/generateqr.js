const qr = require('qrcode')
const Jimp = require('jimp')
const path = require('path')

const generateQR = async (data, output, userlogo) => {
    try {
        // Generar el código QR
        const qrCode = await qr.toBuffer(data, {
            width: 1080
        });

        const focoLogo = path.join(__dirname, '../../foco.png')

        // Cargar el logo
        const logo = await Jimp.read(focoLogo);

        // Redimensionar el logo para que quepa en el código QR
        logo.resize(80, 140);

        // Crear una imagen en blanco del mismo tamaño que el código QR
        const canvas = await Jimp.read(qrCode);

        // Superponer el logo en el centro de la imagen
        const x = (canvas.bitmap.width - logo.bitmap.width) / 1.15;
        const y = (canvas.bitmap.height - logo.bitmap.height) / 1.169;

        canvas.composite(logo, x, y);
        if (userlogo) {
            const ul = await Jimp.read(userlogo)

            ul.resize(200, 200)

            const x = (canvas.bitmap.width - ul.bitmap.width) / 2;
            const y = (canvas.bitmap.height - ul.bitmap.height) / 2;

            canvas.composite(ul, x, y)
        }

        // Guardar la imagen resultante con el código QR y el logo
        await canvas.writeAsync(output);

        console.log('QR code with logo generated successfully!');
    } catch (error) {
        console.error('Error generating QR code with logo:', error);
    }
};

module.exports = {
    generateQR
}