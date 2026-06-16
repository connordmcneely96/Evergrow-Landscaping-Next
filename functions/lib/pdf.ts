import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib';
import {
    TITLE,
    AUTHORIZE_SENTENCE,
    TERMS,
    TERMS_VERSION,
} from './contract';

const FOREST_GREEN = rgb(0x13 / 255, 0x73 / 255, 0x3a / 255);
const DEEP_CHARCOAL = rgb(0x1f / 255, 0x1f / 255, 0x1f / 255);
const MUTED = rgb(0.4, 0.4, 0.4);

const PAGE_WIDTH = 612; // US Letter
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = 70; // keep clear of the footer

export interface AgreementPdfInput {
    customerName: string;
    serviceAddress: string;
    phone: string;
    email: string;
    printedName: string;
    signedDate: string;
    signatureDataUrl: string;
    ip: string;
    timestamp: string;
}

/**
 * Wrap a string into lines that fit within maxWidth at the given font size.
 * pdf-lib has no automatic word wrapping, so we measure each word.
 */
function wrapText(
    text: string,
    font: PDFFont,
    size: number,
    maxWidth: number
): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
            lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }
    if (current) lines.push(current);
    return lines.length > 0 ? lines : [''];
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export async function generateAgreementPdf(
    input: AgreementPdfInput
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page: PDFPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT;

    // Forest-green title bar on the first page.
    const TITLE_BAR_HEIGHT = 60;
    page.drawRectangle({
        x: 0,
        y: PAGE_HEIGHT - TITLE_BAR_HEIGHT,
        width: PAGE_WIDTH,
        height: TITLE_BAR_HEIGHT,
        color: FOREST_GREEN,
    });
    page.drawText(TITLE, {
        x: MARGIN,
        y: PAGE_HEIGHT - 38,
        size: 16,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    y = PAGE_HEIGHT - TITLE_BAR_HEIGHT - 30;

    // Ensure there is room for `needed` vertical space; otherwise add a page.
    function ensureSpace(needed: number) {
        if (y - needed < BOTTOM_LIMIT) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            y = PAGE_HEIGHT - MARGIN;
        }
    }

    function drawParagraph(
        text: string,
        opts: {
            size?: number;
            font?: PDFFont;
            color?: ReturnType<typeof rgb>;
            indent?: number;
            gap?: number;
            lineGap?: number;
        } = {}
    ) {
        const size = opts.size ?? 11;
        const useFont = opts.font ?? font;
        const color = opts.color ?? DEEP_CHARCOAL;
        const indent = opts.indent ?? 0;
        const lineHeight = size + (opts.lineGap ?? 4);
        const lines = wrapText(text, useFont, size, CONTENT_WIDTH - indent);

        for (const line of lines) {
            ensureSpace(lineHeight);
            page.drawText(line, {
                x: MARGIN + indent,
                y: y - size,
                size,
                font: useFont,
                color,
            });
            y -= lineHeight;
        }
        y -= opts.gap ?? 0;
    }

    function drawField(label: string, value: string) {
        ensureSpace(16);
        const labelText = `${label}: `;
        page.drawText(labelText, {
            x: MARGIN,
            y: y - 11,
            size: 11,
            font: fontBold,
            color: FOREST_GREEN,
        });
        const labelWidth = fontBold.widthOfTextAtSize(labelText, 11);
        // Value may wrap; treat the remaining width on the first line.
        const valueLines = wrapText(
            value,
            font,
            11,
            CONTENT_WIDTH - labelWidth
        );
        page.drawText(valueLines[0], {
            x: MARGIN + labelWidth,
            y: y - 11,
            size: 11,
            font,
            color: DEEP_CHARCOAL,
        });
        y -= 16;
        for (let i = 1; i < valueLines.length; i++) {
            ensureSpace(16);
            page.drawText(valueLines[i], {
                x: MARGIN + labelWidth,
                y: y - 11,
                size: 11,
                font,
                color: DEEP_CHARCOAL,
            });
            y -= 16;
        }
    }

    // Fields
    drawField('Name', input.customerName);
    drawField('Service Address', input.serviceAddress);
    drawField('Phone', input.phone);
    drawField('Email', input.email);
    y -= 10;

    // Authorize sentence
    drawParagraph(AUTHORIZE_SENTENCE, { size: 11, gap: 12 });

    // Terms heading
    drawParagraph('I understand and agree to the following:', {
        size: 12,
        font: fontBold,
        gap: 8,
    });

    // Numbered terms with hanging indent.
    TERMS.forEach((term, i) => {
        const number = `${i + 1}.`;
        ensureSpace(15);
        page.drawText(number, {
            x: MARGIN,
            y: y - 11,
            size: 11,
            font: fontBold,
            color: FOREST_GREEN,
        });
        drawParagraph(term, { size: 11, indent: 22, gap: 6 });
    });

    y -= 14;

    // Signature image
    const base64 = input.signatureDataUrl.replace(
        /^data:image\/png;base64,/,
        ''
    );
    try {
        const sigBytes = base64ToUint8Array(base64);
        const sigImage = await pdfDoc.embedPng(sigBytes);
        const maxSigWidth = 220;
        const maxSigHeight = 90;
        const scale = Math.min(
            maxSigWidth / sigImage.width,
            maxSigHeight / sigImage.height,
            1
        );
        const sigWidth = sigImage.width * scale;
        const sigHeight = sigImage.height * scale;

        ensureSpace(sigHeight + 40);
        drawParagraph('Signature:', { size: 11, font: fontBold, gap: 4 });
        page.drawImage(sigImage, {
            x: MARGIN,
            y: y - sigHeight,
            width: sigWidth,
            height: sigHeight,
        });
        y -= sigHeight + 8;
        page.drawLine({
            start: { x: MARGIN, y },
            end: { x: MARGIN + maxSigWidth, y },
            thickness: 1,
            color: MUTED,
        });
        y -= 14;
    } catch {
        // If the signature image is malformed, continue without it rather
        // than failing the whole PDF.
        ensureSpace(20);
        drawParagraph('Signature: [unavailable]', { size: 11, gap: 6 });
    }

    drawField('Printed Name', input.printedName);
    drawField('Signed Date', input.signedDate);

    // Footer on the (current) last page.
    const footer = `Signed electronically on ${input.signedDate} • IP ${input.ip} • ${input.timestamp} • Terms ${TERMS_VERSION}`;
    const footerLines = wrapText(footer, font, 8, CONTENT_WIDTH);
    let footerY = 40;
    for (const line of footerLines.reverse()) {
        page.drawText(line, {
            x: MARGIN,
            y: footerY,
            size: 8,
            font,
            color: MUTED,
        });
        footerY += 11;
    }

    return await pdfDoc.save();
}
