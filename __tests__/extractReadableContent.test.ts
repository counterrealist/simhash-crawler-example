import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

import extractReadableContent from '../src/extractReadableContent';

jest.mock('jsdom');
jest.mock('@mozilla/readability');

const mockJSDOM = JSDOM as jest.MockedClass<typeof JSDOM>;
const mockReadability = Readability as jest.MockedClass<typeof Readability>;

describe('extractReadableContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should extract readable text from HTML', () => {
        const mockDocument = {};
        const mockWindow = { document: mockDocument };

        mockJSDOM.mockImplementation(() => ({
            window: mockWindow
        } as any));

        const mockArticle = {
            textContent: 'Test Article\nThis is the main content of the article.',
        };

        const mockParseMethod = jest.fn().mockReturnValue(mockArticle);
        mockReadability.mockImplementation(() => ({
            parse: mockParseMethod,
        } as any));

        const html = `
      <html>
        <head><title>Test</title></head>
        <body>
          <article>
            <h1>Test Article</h1>
            <p>This is the main content of the article.</p>
          </article>
        </body>
      </html>
    `;

        const result = extractReadableContent(html);

        expect(mockJSDOM).toHaveBeenCalledWith(html);
        expect(mockReadability).toHaveBeenCalledWith(mockDocument);
        expect(mockParseMethod).toHaveBeenCalled();
        expect(result).toContain('Test Article');
        expect(result).toContain('This is the main content of the article.');
    });

    test('should return an empty string if content is not readable', () => {
        const mockDocument = {};
        const mockWindow = { document: mockDocument };

        mockJSDOM.mockImplementation(() => ({
            window: mockWindow
        } as any));

        const mockParseMethod = jest.fn().mockReturnValue(null);
        mockReadability.mockImplementation(() => ({
            parse: mockParseMethod,
        } as any));

        const html = `<html><head></head><body><div>No readable content</div></body></html>`;
        const result = extractReadableContent(html);

        expect(result).toBe('');
    });

    test('should throw an error if parsing fails due to invalid HTML', () => {
        mockJSDOM.mockImplementation(() => {
            throw new Error('Invalid HTML');
        });

        const invalidHtml = `\u0000`;

        expect(() => {
            extractReadableContent(invalidHtml);
        }).toThrow('Readability parsing failed: Invalid HTML');
    });

    test('should throw a wrapped error when Readability throws', () => {
        const mockDocument = {};
        const mockWindow = { document: mockDocument };

        mockJSDOM.mockImplementation(() => ({
            window: mockWindow
        } as any));

        const mockParseMethod = jest.fn().mockImplementation(() => {
            throw new Error('Readability crashed');
        });

        mockReadability.mockImplementation(() => ({
            parse: mockParseMethod,
        } as any));

        const html = '<html><body><article><p>content</p></article></body></html>';

        expect(() => extractReadableContent(html)).toThrow('Readability parsing failed: Readability crashed');
    });
});