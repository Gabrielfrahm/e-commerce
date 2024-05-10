import { join } from 'path';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';

// register partials
const headerTemplate = readFileSync(
  join(__dirname, 'partials/header.hbs'),
  'utf8',
);
const footerTemplate = readFileSync(
  join(__dirname, 'partials/footer.hbs'),
  'utf8',
);

Handlebars.registerPartial('header', headerTemplate);
Handlebars.registerPartial('footer', footerTemplate);

// Opções para o nodemailer-express-handlebars
export const handlebarsOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: join(__dirname, 'partials'),
    layoutsDir: __dirname,
    defaultLayout: '',
  },
  viewPath: join(__dirname, 'views'),
  extName: '.hbs',
};
