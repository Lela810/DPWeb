var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pdfme from '@pdfme/generator';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { basePdf } from './assets/basePdf.js';
import { templatePdf } from './assets/templatePdf.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const generate = pdfme.generate;
const font = {
    calibriLight: {
        data: fs.readFileSync(path.join(__dirname, '/assets/fonts/calibri-light.ttf')),
        fallback: true,
    },
    calibriBold: {
        data: fs.readFileSync(path.join(__dirname, '/assets/fonts/calibri-bold.ttf')),
    },
    calibri: {
        data: fs.readFileSync(path.join(__dirname, '/assets/fonts/calibri.ttf')),
    },
};
export function generatePdf() {
    return __awaiter(this, void 0, void 0, function* () {
        const template = {
            schemas: templatePdf,
            basePdf: basePdf,
        };
        const inputs = [
            {
                anschlag: 'Die Vorbereitungen für Weihnachten, produzieren viel Abfall. Wir wollen dem Samichlaus zur Seite stehen und ihm helfen den Abfallberg unter Kontrolle zu bringen.\nWeisst du wie wir dem Samichlaus helfen können?',
                title: 'Der Samichlaus recyclet',
                date: '03. Dezember 2022',
                time: '13.30 - 16.00 Uhr',
                location: 'Pfadiheim Hünenberg',
                mitnehmen: '- Wetterentsprechende Kleider\n- Gefüllte Trinkflasche',
                anschlagMail: 'Topo@pfadihue.ch',
                abmeldenBis: '02.12.2022',
            },
        ];
        const pdf = yield generate({ template, inputs, options: { font } });
        fs.writeFileSync(path.join(__dirname, 'test.pdf'), pdf);
    });
}